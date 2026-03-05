import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#b87333',
                    borderRadius: '36px',
                    color: '#fff',
                    fontSize: '110px',
                    fontWeight: 700,
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                D
            </div>
        ),
        { ...size },
    )
}
