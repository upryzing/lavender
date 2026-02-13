import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RE_TIMESTAMP } from "@revolt/markdown/plugins/timestamps";

const spoilerMark = Decoration.mark({
  class: "cm-spoiler-mark",
});

const spoilerTextMark = Decoration.mark({
  class: "cm-spoiler-text",
});

const katexMark = Decoration.mark({
  class: "md-code",
});

const timestampMark = Decoration.mark({
  class: "cm-timestamp md-code",
});

const markPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>();
      const spoilerRegex = /\|\|([\s\S]+?)\|\|/g;
      const katexRegex = /\$\$([\s\S]+?)\$\$/g;

      for (const { from, to } of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);

        let match;
        while ((match = spoilerRegex.exec(text)) !== null) {
          const start = from + match.index;
          const end = start + match[0].length;
          builder.add(start, start + 2, spoilerMark);
          builder.add(start + 2, end - 2, spoilerTextMark);
          builder.add(end - 2, end, spoilerMark);
        }

        while ((match = katexRegex.exec(text)) !== null) {
          const start = from + match.index;
          const end = start + match[0].length;
          builder.add(start + 2, end - 2, katexMark);
        }

        while ((match = RE_TIMESTAMP.exec(text)) !== null) {
          const start = from + match.index;
          const end = start + match[0].length;
          builder.add(start, end, timestampMark);
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

const markTheme = EditorView.theme({
  ".cm-spoiler-mark": {
    color: "var(--md-sys-color-outline)",
    fontFamily: "var(--fonts-monospace)",
  },
  ".cm-spoiler-text": {
    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-container-lowest)",
  },
  ".cm-timestamp": {
    borderRadius: "var(--borderRadius-md)",
  },
});

export const markPlugins = [markPlugin, markTheme];
