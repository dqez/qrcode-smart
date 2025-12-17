/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import QRCode from "qrcode";

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');

    // Customization params
    const darkColor = '#' + (searchParams.get('dark') || '000000').replace('#', '');
    const lightColor = '#' + (searchParams.get('light') || 'ffffff').replace('#', '');
    const bgColor = '#' + (searchParams.get('bg') || 'ffffff').replace('#', '');
    const title = searchParams.get('title');

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
        dark: darkColor,
        light: lightColor,
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
            backgroundColor: bgColor,
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Decorative Circles */}
          <div style={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: darkColor,
            opacity: 0.05,
          }} />
          <div style={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: darkColor,
            opacity: 0.05,
          }} />

          {title && (
            <div style={{
              fontSize: 70,
              fontWeight: 900,
              color: darkColor,
              marginBottom: 40,
              textAlign: 'center',
              maxWidth: '85%',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              {title}
            </div>
          )}

          <div style={{
            display: 'flex',
            padding: 32,
            backgroundColor: lightColor,
            borderRadius: 48,
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <img src={qrDataUrl} width="400" height="400" alt="QR Code" />
          </div>

          {/* Branding Footer */}
          <div style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 0.6,
          }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: darkColor }}>QRCode Smart</div>
          </div>
        </div>
      ),
      {
        width: 400,
        height: 400,
      }
    );



  } catch (error) {
    return new Response(`Failed to generate the image: ${error}`, { status: 500 });
  };
}
