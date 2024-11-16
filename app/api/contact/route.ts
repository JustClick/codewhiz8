import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    const fullName = `${firstName} ${lastName}`;
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CodeWhiz Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'default@example.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e;">New Contact Form Submission</h2>
            <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="margin-top: 20px;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully",
      data
    });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send email" 
      },
      { status: 500 }
    );
  }
}