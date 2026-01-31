import React, { useState, useRef } from "react";
import { Container, Card, Form, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/PostService";
import "./Community"
import "./CreatePost.css";
import ProfileLoader from "../components/ProfileLoader";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiPicker from "emoji-picker-react";

function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [postData, setPostData] = useState({
    title: "",
    caption: "",
    mediaUrl: "",
    mediaType: "",
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setPostData((prev) => ({
        ...prev,
        caption: editor.getHTML(),
      }));
    },
  });

  const handleMedia = (file) => {
    if (!file) return;
    setPreviewFile(file);
  };

  const handleFileInput = (e) => {
    handleMedia(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleMedia(file);
  };

  const handleEmojiClick = (emojiData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojis(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!editor || !editor.getText().trim()) {
    alert("Post cannot be empty");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", postData.title || "");
    formData.append("caption", editor.getHTML());
    formData.append("anonymous", anonymous.toString());

    if (previewFile) {
      formData.append("file", previewFile);
    }

    console.log("🟡 FRONTEND FORM DATA:", {
      title: postData.title,
      caption: editor.getHTML(),
      anonymous,
      file: previewFile,
    });

    await createPost(formData);

    navigate("/community", { replace: true });
  } catch (err) {
    console.error("Post creation failed", err);
    alert("Failed to create post. Please try again.");
  } finally {
    setLoading(false);
  }
};




  if (loading) return <ProfileLoader />;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm create-post-card">
        <h3 className="fw-bold mb-3">Create a Post</h3>

        <Form onSubmit={handleSubmit}>

          <Form.Control
            className="mb-3"
            name="title"
            placeholder="Post title (optional)"
            value={postData.title}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* BRAND TOOLBAR */}
          <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
            <Button type="button" size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleBold().run()}>B</Button>
            <Button type="button" size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</Button>
            <Button type="button" size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</Button>

            <Button type="button" 
              size="sm"
              variant="outline-pink"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              😊 Emoji
            </Button>

            <Button
              size="sm"
              variant="outline-pink"
              onClick={() => fileInputRef.current.click()}
            >
              📎 Attach
            </Button>

            {anonymous && <Badge bg="secondary">Anonymous</Badge>}
          </div>

          {showEmojis && (
            <div className="mb-3">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* ✍️ EDITOR + DRAG DROP */}
          <div
            className="mb-3 p-3 editor-container"
            style={{ minHeight: "150px", cursor: "text", background: "#fff7fb" }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <EditorContent editor={editor} />
            <div className="text-muted mt-2" style={{ fontSize: 12 }}>
              Drag & drop files here or use Attach
            </div>
          </div>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileInput}
          />

          {/* 🖼️ MEDIA PREVIEW */}
          {previewFile && (
            <div className="mb-3 p-3 attachment-preview rounded">
              <div className="fw-semibold mb-2">Attachment Preview:</div>

              {previewFile.type.startsWith("image") && (
                <img
  src={URL.createObjectURL(previewFile)}
  alt="preview"
  style={{ maxWidth: "100%", borderRadius: 8 }}
/>

              )}

              {previewFile.type.startsWith("video") && (
                <video
  src={URL.createObjectURL(previewFile)}
  controls
  style={{ maxWidth: "100%", borderRadius: 8 }}
/>

              )}

              {!previewFile.type.startsWith("image") &&
                !previewFile.type.startsWith("video") && (
                  <div>📄 {previewFile.name}</div>
                )}
            </div>
          )}

          <Form.Check
            type="switch"
            id="anonymous-switch"
            label="Post anonymously"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="mb-4 empower-switch"
          />

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button type="submit" className="btn-pink" disabled={loading}>
  {loading ? "Publishing..." : "Publish"}
</Button>

          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default CreatePost;
