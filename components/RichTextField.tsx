'use client'

import { useEffect, type CSSProperties } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { notesToHtml } from '@/lib/richText'
import styles from './RichTextField.module.css'

type Props = {
  // HTML (older plain-text values are converted on load).
  value: string
  onChange: (html: string) => void
  ariaLabel: string
  placeholder?: string
}

// A small WYSIWYG editor: bold, italic, underline and lists.
export default function RichTextField({ value, onChange, ariaLabel, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        link: false,
      }),
    ],
    content: notesToHtml(value),
    // The page is rendered on the server first; the editor only exists in the browser.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.content, role: 'textbox', 'aria-multiline': 'true', 'aria-label': ariaLabel },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  })

  // Follow changes made outside the editor (the saved quotation loading, starting from a package).
  useEffect(() => {
    if (!editor) return
    const html = notesToHtml(value)
    if (!html && editor.isEmpty) return
    if (html !== editor.getHTML()) editor.commands.setContent(html, { emitUpdate: false })
  }, [editor, value])

  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive('bold') ?? false,
      italic: editor?.isActive('italic') ?? false,
      underline: editor?.isActive('underline') ?? false,
      bulletList: editor?.isActive('bulletList') ?? false,
      orderedList: editor?.isActive('orderedList') ?? false,
      empty: editor?.isEmpty ?? true,
    }),
  })

  const buttons = [
    { key: 'bold', label: 'B', title: 'Bold', run: () => editor?.chain().focus().toggleBold().run() },
    { key: 'italic', label: 'I', title: 'Italic', run: () => editor?.chain().focus().toggleItalic().run() },
    { key: 'underline', label: 'U', title: 'Underline', run: () => editor?.chain().focus().toggleUnderline().run() },
    { key: 'bulletList', label: '• List', title: 'Bulleted list', run: () => editor?.chain().focus().toggleBulletList().run() },
    { key: 'orderedList', label: '1. List', title: 'Numbered list', run: () => editor?.chain().focus().toggleOrderedList().run() },
  ] as const

  return (
    <div
      className={`${styles.wrapper} ${active?.empty ? styles.empty : ''}`}
      style={{ '--placeholder': JSON.stringify(placeholder ?? '') } as CSSProperties}
    >
      <div className={styles.toolbar} role="toolbar" aria-label={`${ariaLabel} formatting`}>
        {buttons.map((button) => (
          <button
            key={button.key}
            type="button"
            title={button.title}
            aria-pressed={active?.[button.key] ?? false}
            className={`${styles.button} ${styles[button.key]} ${active?.[button.key] ? styles.active : ''}`}
            // Keep the text selection while clicking the toolbar.
            onMouseDown={(e) => e.preventDefault()}
            onClick={button.run}
            disabled={!editor}
          >
            {button.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
