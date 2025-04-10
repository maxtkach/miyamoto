import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Получаем данные из запроса
    const { from_name, from_email, service_type, message, to_email } = body;
    
    // Проверяем обязательные поля
    if (!from_name || !from_email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }
    
    // Создаем объект для формирования тела письма
    const emailBody = `
      Name: ${from_name}
      Email: ${from_email}
      Service: ${service_type || 'Not specified'}
      
      Message:
      ${message}
    `;
    
    // Отправляем через Email.js с жестко закодированными параметрами
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_p5m589h',
        template_id: 'template_6c1adja',
        user_id: 'aOBOUxfnanX1UxKvZ',
        template_params: {
          to_email: to_email,
          from_name: from_name,
          from_email: from_email,
          service_type: service_type,
          message: message,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 