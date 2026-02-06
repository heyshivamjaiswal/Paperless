import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlockNoteView } from '@blocknote/shadcn';
import {
  useCreateBlockNote,
  FormattingToolbarController,
  FormattingToolbar,
  BlockTypeSelect,
  BasicTextStyleButton,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  NestBlockButton,
  UnnestBlockButton,
  TextAlignButton,
  LinkToolbarController,
  LinkToolbar,
  EditLinkButton,
  OpenLinkButton,
  DeleteLinkButton,
} from '@blocknote/react';

import {
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultBlockSpecs,
  type BlockNoteEditor,
  type PartialBlock,
} from '@blocknote/core';

import { codeBlockOptions } from '@blocknote/code-block';
import AlertButton from '../components/editorComponent/AlertButton';
import { ToggleBlock } from '../components/editorComponent/Toggle';
import { usePagesStore } from '../store/pageStore';
import getTitleFromFirstHeading from '../utils/titleFromHeading';
import { updateFirstHeading } from '../utils/updatePageTitle';

const EMPTY_PAGE: PartialBlock[] = [{ type: 'paragraph', content: [] }];

export default function BlockEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const pages = usePagesStore((s) => s.pages);
  const createPage = usePagesStore((s) => s.createPage);
  const updatePageContent = usePagesStore((s) => s.updatePageContent);
  const updatePageTitle = usePagesStore((s) => s.updatePageTitle);

  useEffect(() => {
    if (pageId === 'new') {
      const id = createPage();
      navigate(`/page/${id}`, { replace: true });
    }
  }, [pageId, createPage, navigate]);

  const page = pages.find((p) => p.id === pageId) ?? null;

  const editor = useCreateBlockNote({
    initialContent: EMPTY_PAGE,

    onChange: (editor: BlockNoteEditor) => {
      if (!page) return;

      const doc = editor.document;
      updatePageContent(page.id, doc);

      if (page.titleManuallyEdited) return;

      const titleFromDoc = getTitleFromFirstHeading(doc);
      if (!titleFromDoc) return;

      if (page.title !== titleFromDoc) {
        updatePageTitle(page.id, titleFromDoc);
      }
    },

    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },

    schema: BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        toggle: ToggleBlock(),
        codeBlock: createCodeBlockSpec(codeBlockOptions),
      },
    }),

    uploadFile,
  });

  useEffect(() => {
    if (!page) return;

    editor.replaceBlocks(
      editor.document,
      page.content.length > 0 ? page.content : EMPTY_PAGE
    );
  }, [pageId]);

  useEffect(() => {
    if (!page || !page.titleManuallyEdited) return;

    const updated = updateFirstHeading(editor.document, page.title);
    if (updated !== editor.document) {
      editor.replaceBlocks(editor.document, updated);
    }
  }, [page?.title]);

  if (!page) return null;

  return (
    <BlockNoteView
      editor={editor}
      formattingToolbar={false}
      slashMenu={false}
      className="w-full h-full bg-transparent text-white flex flex-col pl-28 pt-60 overflow-y-auto"
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect />
            <FileCaptionButton />
            <FileReplaceButton />
            <BasicTextStyleButton basicTextStyle="bold" />
            <BasicTextStyleButton basicTextStyle="italic" />
            <BasicTextStyleButton basicTextStyle="underline" />
            <BasicTextStyleButton basicTextStyle="strike" />
            <BasicTextStyleButton basicTextStyle="code" />
            <TextAlignButton textAlignment="left" />
            <TextAlignButton textAlignment="center" />
            <TextAlignButton textAlignment="right" />
            <ColorStyleButton />
            <NestBlockButton />
            <UnnestBlockButton />
            <CreateLinkButton />
          </FormattingToolbar>
        )}
      />

      <LinkToolbarController
        linkToolbar={(props) => (
          <LinkToolbar {...props}>
            <EditLinkButton {...props} />
            <OpenLinkButton url={props.url} />
            <DeleteLinkButton {...props} />
            <AlertButton {...props} />
          </LinkToolbar>
        )}
      />
    </BlockNoteView>
  );
}

async function uploadFile(file: File) {
  const body = new FormData();
  body.append('file', file);

  const res = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body,
  });

  const json = await res.json();
  return json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
}
