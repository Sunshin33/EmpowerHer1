import React, { useEffect, useRef, useState } from "react";
import { Container, Card, Form, Button, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/PostService";
import ProfileLoader from "../components/ProfileLoader";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiPicker from "emoji-picker-react";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  /* ================= LOAD POST ================= */
  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPostById(id);

        setPostData({
          title: post.title || "",
          caption: post.caption || "",
          mediaUrl: post.mediaUrl || "",
          mediaType: post.mediaType || "",
        });

        setAnonymous(!!post.anonymous);
        editor?.commands.setContent(post.caption || "");
      } catch (err) {
  console.error("Failed to load post", err);
  alert("Failed to load post. Check console.");
} finally {
        setLoading(false);
      }
    };

    if (editor) loadPost();
  }, [id, editor, navigate]);

  /* ================= FILE HANDLING ================= */
  const handleMedia = (file) => {
    if (!file) return;
    setPreviewFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPostData((prev) => ({
        ...prev,
        mediaUrl: reader.result,
        mediaType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emojiData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojis(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("caption", editor.getHTML());
      formData.append("anonymous", anonymous);

      if (previewFile) {
        formData.append("file", previewFile);
      }

      await updatePost(id, formData);

      navigate("/community");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileLoader />;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm">
        <h3 className="fw-bold mb-3">Edit Post</h3>

        <Form>
          <Form.Control
            className="mb-3"
            placeholder="Post title (optional)"
            value={postData.title}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* TOOLBAR */}
          <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
            <Button size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleBold().run()}>B</Button>
            <Button size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</Button>
            <Button size="sm" className="btn-pink" onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</Button>

            <Button size="sm" variant="outline-pink" onClick={() => setShowEmojis(!showEmojis)}>
              😊 Emoji
            </Button>

            <Button size="sm" variant="outline-pink" onClick={() => fileInputRef.current.click()}>
              📎 Replace File
            </Button>

            {anonymous && <Badge bg="secondary">Anonymous</Badge>}
          </div>

          {showEmojis && (
            <div className="mb-3">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* EDITOR */}
          <div className="mb-3 p-3 border rounded" style={{ minHeight: "150px", background: "#fff7fb" }}>
            <EditorContent editor={editor} />
          </div>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={(e) => handleMedia(e.target.files[0])}
          />

          {/* EXISTING OR NEW FILE */}
          {(postData.mediaUrl || previewFile) && (
            <div className="mb-3 p-3 border rounded bg-light">
              <div className="fw-semibold mb-2">Attachment</div>

              {postData.mediaType?.startsWith("image") && (
                <img src={postData.mediaUrl} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
              )}

              {postData.mediaType?.startsWith("video") && (
                <video src={postData.mediaUrl} controls style={{ maxWidth: "100%", borderRadius: 8 }} />
              )}

              {!postData.mediaType?.startsWith("image") &&
                !postData.mediaType?.startsWith("video") && (
                  <div>📄 Attached Document</div>
                )}
            </div>
          )}

          <Form.Check
            type="switch"
            label="Post anonymously"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="mb-4 empower-switch"
          />

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button className="btn-pink" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default EditPost;
