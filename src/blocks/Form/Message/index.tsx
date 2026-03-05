import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
    return (
        <Width className="my-6" width="100">
            {message && (
                <div className="rounded-2xl border border-copper/20 bg-copper/5 p-6 shadow-sm">
                    <RichText
                        data={message}
                        enableGutter={false}
                        className="prose-p:m-0 font-medium text-foreground/90"
                    />
                </div>
            )}
        </Width>
    )
}
