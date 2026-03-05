import React from 'react'
import Image from 'next/image'

export const AdminIcon: React.FC = () => {
    return (
        <div
            className="admin-icon"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Image
                src="/logo.svg"
                alt="D"
                width={32}
                height={32}
                style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                }}
            />
        </div>
    )
}
