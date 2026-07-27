import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { Box, Divider, Stack, ToggleButton, Tooltip, useTheme } from '@mui/material';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function Btn({
  active,
  disabled,
  onClick,
  title,
  children
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <span>
        <ToggleButton
          value={title}
          selected={Boolean(active)}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick}
          size="small"
          sx={{ px: 1, py: 0.25, border: 0, borderRadius: 1, minWidth: 30, fontWeight: 600, lineHeight: 1 }}
        >
          {children}
        </ToggleButton>
      </span>
    </Tooltip>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const inTable = editor.isActive('table');
  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={0.25} sx={{ p: 0.5 }}>
      <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
      <Btn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>{'</>'}</Btn>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
      <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</Btn>
      <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</Btn>
      <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;</Btn>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
      <Btn
        title="Link"
        active={editor.isActive('link')}
        onClick={() => {
          const prev = editor.getAttributes('link').href as string | undefined;
          const url = window.prompt('URL', prev ?? 'https://');
          if (url === null) return;
          if (url === '') editor.chain().focus().unsetLink().run();
          else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
      >
        🔗
      </Btn>
      <Btn title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>▦</Btn>
      {inTable && (
        <>
          <Btn title="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()}>+Col</Btn>
          <Btn title="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>+Row</Btn>
          <Btn title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>−Col</Btn>
          <Btn title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>−Row</Btn>
          <Btn title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>✕Tbl</Btn>
        </>
      )}
    </Stack>
  );
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 120 }: RichTextEditorProps) {
  const theme = useTheme();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write here…' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML())
  });

  // keep the editor in sync if the value is replaced externally (e.g. loaded async)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        <Toolbar editor={editor} />
      </Box>
      <Box
        sx={{
          '& .ProseMirror': {
            minHeight,
            p: 1.5,
            outline: 'none',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
              float: 'left',
              height: 0,
              pointerEvents: 'none'
            },
            '& table': { borderCollapse: 'collapse', width: '100%', margin: '8px 0', tableLayout: 'fixed' },
            '& td, & th': { border: `1px solid ${theme.palette.divider}`, padding: '6px 8px', verticalAlign: 'top' },
            '& th': { background: theme.palette.action.hover, fontWeight: 600 },
            '& blockquote': { borderLeft: `3px solid ${theme.palette.primary.main}`, margin: '8px 0', paddingLeft: 12, color: theme.palette.text.secondary },
            '& code': { background: theme.palette.action.hover, padding: '1px 4px', borderRadius: 4, fontFamily: 'Roboto Mono, monospace', fontSize: '0.85em' },
            '& ul, & ol': { paddingLeft: 22, margin: '6px 0' },
            '& a': { color: theme.palette.primary.main, textDecoration: 'underline' }
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
