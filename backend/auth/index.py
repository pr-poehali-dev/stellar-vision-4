"""Регистрация, вход, выход и проверка сессии для клиентов Delta Travel"""
import json
import os
import hashlib
import secrets
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_db():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    return conn, cur

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    body = json.loads(event.get('body', '{}')) if event.get('body') else {}
    action = body.get('action', '')
    method = event.get('httpMethod', 'GET')

    # Определяем действие из пути или из body.action
    path = event.get('path', '/')
    if '/register' in path:
        action = 'register'
    elif '/login' in path:
        action = 'login'
    elif '/me' in path:
        action = 'me'
    elif '/update' in path:
        action = 'update'
    elif '/logout' in path:
        action = 'logout'

    if action == 'register':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        first_name = body.get('first_name', '').strip()
        last_name = body.get('last_name', '').strip()
        phone = body.get('phone', '').strip()

        if not email or not password or not first_name or not last_name:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все обязательные поля'}, ensure_ascii=False)}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'}, ensure_ascii=False)}

        conn, cur = get_db()
        cur.execute(f'SELECT id FROM "{schema}".delta_users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пользователь с таким email уже существует'}, ensure_ascii=False)}

        cur.execute(
            f'INSERT INTO "{schema}".delta_users (email, password_hash, first_name, last_name, phone) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            (email, hash_password(password), first_name, last_name, phone)
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        cur.execute(f'INSERT INTO "{schema}".delta_sessions (user_id, token) VALUES (%s, %s)', (user_id, token))
        conn.commit(); cur.close(); conn.close()

        return {
            'statusCode': 200, 'headers': CORS_HEADERS,
            'body': json.dumps({'success': True, 'token': token, 'user': {'id': user_id, 'email': email, 'first_name': first_name, 'last_name': last_name}}, ensure_ascii=False)
        }

    if action == 'login':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')

        conn, cur = get_db()
        cur.execute(f'SELECT id, first_name, last_name, phone FROM "{schema}".delta_users WHERE email = %s AND password_hash = %s', (email, hash_password(password)))
        user = cur.fetchone()
        if not user:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный email или пароль'}, ensure_ascii=False)}

        token = secrets.token_hex(32)
        cur.execute(f'INSERT INTO "{schema}".delta_sessions (user_id, token) VALUES (%s, %s)', (user[0], token))
        conn.commit(); cur.close(); conn.close()

        return {
            'statusCode': 200, 'headers': CORS_HEADERS,
            'body': json.dumps({'success': True, 'token': token, 'user': {'id': user[0], 'first_name': user[1], 'last_name': user[2], 'email': email, 'phone': user[3]}}, ensure_ascii=False)
        }

    if action == 'me':
        token = event.get('headers', {}).get('X-Session-Token', '')
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'}, ensure_ascii=False)}

        conn, cur = get_db()
        cur.execute(
            f'''SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.birth_date, u.passport_series, u.passport_number, u.created_at
               FROM "{schema}".delta_users u JOIN "{schema}".delta_sessions s ON s.user_id = u.id
               WHERE s.token = %s AND s.expires_at > NOW()''',
            (token,)
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'}, ensure_ascii=False)}

        cur.close(); conn.close()
        return {
            'statusCode': 200, 'headers': CORS_HEADERS,
            'body': json.dumps({'user': {
                'id': row[0], 'email': row[1], 'first_name': row[2], 'last_name': row[3],
                'phone': row[4], 'birth_date': str(row[5]) if row[5] else None,
                'passport_series': row[6], 'passport_number': row[7],
                'created_at': str(row[8])
            }}, ensure_ascii=False)
        }

    if action == 'update':
        token = event.get('headers', {}).get('X-Session-Token', '')
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'}, ensure_ascii=False)}

        conn, cur = get_db()
        cur.execute(f'SELECT user_id FROM "{schema}".delta_sessions WHERE token = %s AND expires_at > NOW()', (token,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'}, ensure_ascii=False)}

        user_id = row[0]
        cur.execute(
            f'''UPDATE "{schema}".delta_users SET first_name=%s, last_name=%s, phone=%s, birth_date=%s,
               passport_series=%s, passport_number=%s, updated_at=NOW() WHERE id=%s''',
            (body.get('first_name'), body.get('last_name'), body.get('phone'),
             body.get('birth_date') or None, body.get('passport_series'), body.get('passport_number'), user_id)
        )
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True}, ensure_ascii=False)}

    if action == 'logout':
        token = event.get('headers', {}).get('X-Session-Token', '')
        if token:
            conn, cur = get_db()
            cur.execute(f'UPDATE "{schema}".delta_sessions SET expires_at = NOW() WHERE token = %s', (token,))
            conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True}, ensure_ascii=False)}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'}, ensure_ascii=False)}
