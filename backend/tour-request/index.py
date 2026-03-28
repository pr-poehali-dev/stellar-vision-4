"""Отправка заявки на подбор тура на почту агентства и сохранение в БД"""
import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Token',
}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    destination = body.get('destination', '')
    departure_date = body.get('departure_date', '')
    duration = body.get('duration', '')
    adults = body.get('adults', 2)
    children = body.get('children', 0)
    budget = body.get('budget', '')
    comment = body.get('comment', '')
    user_id = body.get('user_id')

    if not name or not phone:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Имя и телефон обязательны'}, ensure_ascii=False)}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO "{schema}".delta_tour_requests (user_id, name, phone, email, destination, departure_date, duration, adults, children, budget, comment)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (user_id, name, phone, email, destination, departure_date, duration, adults, children, budget, comment)
    )
    request_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    gmail_password = os.environ.get('GMAIL_APP_PASSWORD', '')
    if gmail_password:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'🌍 Новая заявка на тур #{request_id} — {name}'
            msg['From'] = 'deltacompany68@gmail.com'
            msg['To'] = 'deltacompany68@gmail.com'

            html = f"""
            <html><body style="font-family: Arial, sans-serif; color: #1a1a1a; background: #f5f0e8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 32px; border-top: 4px solid #1A5C38;">
              <h2 style="color: #1A5C38; margin: 0 0 24px;">Новая заявка на тур №{request_id}</h2>
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 40%;">Имя клиента</td><td style="padding: 8px 0; font-weight: bold;">{name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Телефон</td><td style="padding: 8px 0; font-weight: bold;"><a href="tel:{phone}">{phone}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">{email or '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Направление</td><td style="padding: 8px 0;">{destination or '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Дата вылета</td><td style="padding: 8px 0;">{departure_date or '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Длительность</td><td style="padding: 8px 0;">{duration or '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Взрослые / Дети</td><td style="padding: 8px 0;">{adults} / {children}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Бюджет</td><td style="padding: 8px 0;">{budget or '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Комментарий</td><td style="padding: 8px 0;">{comment or '—'}</td></tr>
              </table>
              <p style="margin-top: 24px; color: #999; font-size: 12px;">Delta Travel · info@delta-travel.ru · +7 (817) 123-45-67</p>
            </div>
            </body></html>
            """
            msg.attach(MIMEText(html, 'html', 'utf-8'))
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login('deltacompany68@gmail.com', gmail_password)
                server.sendmail('deltacompany68@gmail.com', 'deltacompany68@gmail.com', msg.as_string())
        except Exception as e:
            pass

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'success': True, 'request_id': request_id}, ensure_ascii=False)
    }
