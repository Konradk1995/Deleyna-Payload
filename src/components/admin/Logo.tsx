import React from 'react'
import Image from 'next/image'

export const AdminLogo: React.FC = () => {
    return (
        <div className="admin-logo" style={{ padding: '10px 0' }}>
            <Image
                src="/logo.svg"
                alt="Deleyna"
                width={140}
                height={40}
                style={{
                    width: '140px',
                    height: 'auto',
                    filter: 'brightness(0) invert(1)', // Making it white for the dark sidebar if needed, or keeping it as is.
                    // Deleyna logo usually looks better in white/gold on dark.
                }}
            />
        </div>
    )
}
