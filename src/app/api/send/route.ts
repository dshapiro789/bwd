import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, projectType, budget, description, timeline } = body;

        const { data, error } = await resend.emails.send({
            from: 'Bonsai Web Design <onboarding@resend.dev>', // Default testing domain
            to: ['contact@bonsaiwebdesign.com'], // Ideally this should be the user's email, but for now we send to the owner
            subject: `New Project Inquiry from ${name}`,
            html: `
        <h1>New Project Inquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
        <br/>
        <h3>Description:</h3>
        <p>${description}</p>
      `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
