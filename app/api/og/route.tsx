/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { checkDomainAllowed } from "@/lib/saas-logic";

export const runtime = 'nodejs'; // ImageResponse + qrcode cần Nodejs

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const content = searchParams.get('content'); // Ưu tiên content

    // SaaS Security: Lấy Referer để check xem request từ đâu đến
    const referer = request.headers.get('referer') || request.headers.get('origin');

    // --- BƯỚC 1: SAAS LOGIC (Check Plan & Domain) ---
    const isAllowed = await checkDomainAllowed(referer);

    const isPro = true; // Test tạm

    if (!isAllowed) {
      // Nếu domain ăn cắp link -> Trả về ảnh lỗi hoặc ảnh mờ
      return new Response('Unauthorized Domain: Please add your domain in the dashboard.', { status: 403 });
    }

    // --- BƯỚC 2: CUSTOMIZATION ---
    // user Pro được chỉnh màu, user Free bị ép về màu đen/trắng
    const darkColor = isPro ? ('#' + (searchParams.get('dark') || '000000').replace('#', '')) : '#000000';
    const lightColor = isPro ? ('#' + (searchParams.get('light') || 'ffffff').replace('#', '')) : '#ffffff';
    const bgColor = '#' + (searchParams.get('bg') || 'ffffff').replace('#', '');
    const title = searchParams.get('title');

    // Cho phép chỉnh size (mặc định 400)
    const size = parseInt(searchParams.get('size') || '400');
    const clampedSize = Math.min(Math.max(size, 200), 1200); // Giới hạn 200px - 1200px

    if (!text && !content) {
      return new Response('No content provided', { status: 400 });
    }

    const decodedText = content || Buffer.from(text || '', 'base64').toString('utf8');

    // Tạo QR Data URL
    const qrDataUrl = await QRCode.toDataURL(decodedText, {
      width: 600, // Render to để nét
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    });

    // --- BƯỚC 3: RENDER ẢNH ---
    const imageResponse = new ImageResponse(
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
          {/* Decorative Circles - Chỉ hiện nếu size đủ lớn */}
          <div style={{
            position: 'absolute',
            top: -50, left: -50, width: clampedSize * 0.75, height: clampedSize * 0.75,
            borderRadius: '50%', backgroundColor: darkColor, opacity: 0.05,
          }} />
          <div style={{
            position: 'absolute',
            bottom: -50, right: -50, width: clampedSize * 0.75, height: clampedSize * 0.75,
            borderRadius: '50%', backgroundColor: darkColor, opacity: 0.05,
          }} />

          {title && (
            <div style={{
              fontSize: clampedSize * 0.1, // Font size responsive theo size ảnh
              fontWeight: 900,
              color: darkColor,
              marginBottom: clampedSize * 0.05,
              textAlign: 'center',
              maxWidth: '85%',
              lineHeight: 1.1,
            }}>
              {title}
            </div>
          )}

          <div style={{
            display: 'flex',
            padding: clampedSize * 0.05, // Padding responsive
            backgroundColor: lightColor,
            borderRadius: clampedSize * 0.1,
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <img src={qrDataUrl} width={clampedSize * 0.6} height={clampedSize * 0.6} alt="QR Code" />
          </div>

          {/* Branding - Nếu không phải Pro thì bắt buộc hiện branding của bạn */}
          {(!isPro || searchParams.get('branding') === 'true') && (
            <div style={{
              position: 'absolute',
              bottom: 20,
              display: 'flex',
              alignItems: 'center',
              opacity: 0.6,
            }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: darkColor }}>Powered by QRCode Smart</div>
            </div>
          )}
        </div>
      ),
      {
        width: clampedSize,
        height: clampedSize,
      }
    );

    // Cache ở CDN (Vercel Edge) và Browser trong 1 ngày (86400s)
    imageResponse.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    return imageResponse;

  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate: ${error}`, { status: 500 });
  };
}
