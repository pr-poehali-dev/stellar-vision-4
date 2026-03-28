"""Получение заявок и данных профиля клиента Delta Travel"""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_db():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    return conn, cur

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
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
        f'''SELECT id, name, phone, email, destination, departure_date, duration, adults, children, budget, comment, status, created_at
           FROM "{schema}".delta_tour_requests WHERE user_id = %s ORDER BY created_at DESC''',
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close(); conn.close()

    status_labels = {'new': 'Новая', 'in_progress': 'В обработке', 'confirmed': 'Подтверждена', 'completed': 'Завершена', 'cancelled': 'Отменена'}
    requests = []
    for r in rows:
        requests.append({
            'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
            'destination': r[4], 'departure_date': r[5], 'duration': r[6],
            'adults': r[7], 'children': r[8], 'budget': r[9], 'comment': r[10],
            'status': r[11], 'status_label': status_labels.get(r[11], r[11]),
            'created_at': str(r[12])
        })

    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'requests': requests}, ensure_ascii=False)}
