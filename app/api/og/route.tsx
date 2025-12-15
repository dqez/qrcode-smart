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
      width: 600,
      margin: 2,
      color: {
        dark: '#000',
        light: '#fff',
      },
    });

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <img src={qrDataUrl} width="500" height="500" alt="QR Code" />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );



  } catch (error) {
    return new Response(`Failed to generate the image: ${error}`, { status: 500 });
  };
}
