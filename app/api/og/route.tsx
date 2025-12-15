/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import QRCode from "qrcode";

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');

    if (!text) {
      return new ImageResponse(
        <div style={{ display: 'flex', fontSize: 40, color: 'black', background: 'white', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          No content provided
        </div>,
        { width: 1200, height: 630 }
      );
    }

    const decodedText = Buffer.from(text, 'base64').toString('utf8');

    const qrDataUrl = await QRCode.toDataURL(decodedText, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000',
        light: '#fff',
      },
    });

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f9ff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, background: 'white', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: 40, marginBottom: 20, color: '#333' }}>QR Code Content</h1>
          <img src={qrDataUrl} width="300" height="300" alt="QR Code" />
          <p style={{ fontSize: 20, marginTop: 20, color: '#666' }}>Scan to view content</p>
        </div>
      </div>
    )


  } catch (error) {
    return new Response(`Failed to generate the image: ${error}`, { status: 500 });
  };
}
