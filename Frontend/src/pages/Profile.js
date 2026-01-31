import React, { useEffect, useState } from "react";
import "./Profile.css";
import {
  Container,
  Card,
  Button,
  Image,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
// ADD THESE IMPORTS
import { FaLink, FaInstagram, FaLinkedin, FaGithub, FaFacebook, FaEnvelope, FaGlobe, FaPlus, FaTrash } from "react-icons/fa";
import { addSocialLink, deleteSocialLink } from "../services/SocialService";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyPostsSection from "../components/MyPostsSection";
import ProfileLoader from "../components/ProfileLoader";
import { getProfile } from "../services/ProfileService";
import { getContacts, createContact } from "../services/ContactService";
import { getJournals, createJournal } from "../services/JournalService";
import { updateJournal, deleteJournal } from "../services/JournalService";
import { useAuth } from "../auth/AuthContext";

function Profile() {
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const { user: authUser, loading: authLoading } = useAuth();

  /* ================= PROFILE ================= */
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ================= JOURNALS ================= */
  const [journals, setJournals] = useState([]);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [editingJournal, setEditingJournal] = useState(null);
  const [journalTitle, setJournalTitle] = useState("");
  const [viewingJournal, setViewingJournal] = useState(null);

  /* ================= CONTACTS ================= */
  const [contacts, setContacts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState({
    relation: "parent",
    name: "",
    address: "",
    phone1: "",
    phone2: "",
    email: "",
  });

  /* ================= SOCIAL LINKS ================= */
const [showSocialModal, setShowSocialModal] = useState(false);
const [socialLinks, setSocialLinks] = useState([]);
const [newSocial, setNewSocial] = useState({
  platform: "instagram",
  url: ""
});

const iconMap = {
  instagram: <FaInstagram color="#E1306C" />,
  linkedin: <FaLinkedin color="#0077B5" />,
  github: <FaGithub color="#000" />,
  facebook: <FaFacebook color="#1877F2" />,
  gmail: <FaEnvelope color="#D44638" />,
  website: <FaGlobe color="#ff1493" />
};

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!authUser) return;

    const loadData = async () => {
      try {
        const profile = await getProfile();
        const journalRes = await getJournals();
        const contactsRes = await getContacts();

        setUser(profile);
        setSocialLinks(profile.socialLinks || []);
        setJournals(journalRes);
        setContacts(contactsRes);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadData();
  }, [authUser]);

  /* ================= GUARDS ================= */
  if (authLoading || loadingProfile) {
    return <ProfileLoader />;
  }

  if (!authUser) {
    return null;
  }

  if (!user) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  /* ================= SAVE JOURNAL ================= */
 const saveJournal = async () => {
  if (!journalTitle.trim() || !journalText.trim()) return;

  if (editingJournal) {
    const updated = await updateJournal(
      editingJournal._id,
      journalTitle,
      journalText
    );

    setJournals(
      journals.map((j) =>
        j._id === updated._id ? updated : j
      )
    );
  } else {
    const newJournal = await createJournal(
      journalTitle,
      journalText
    );
    setJournals([newJournal, ...journals]);
  }

  setJournalTitle("");
  setJournalText("");
  setEditingJournal(null);
  setShowJournalModal(false);
};

const handleEditJournal = (journal) => {
  setEditingJournal(journal);
  setJournalTitle(journal.title);
  setJournalText(journal.text);
  setShowJournalModal(true);
};

const handleDeleteJournal = async (id) => {
  await deleteJournal(id);
  setJournals(journals.filter((j) => j._id !== id));
};

  /* ================= SAVE CONTACT ================= */
  const saveContact = async () => {
    if (!contactData.name || !contactData.phone1) return;

    const newContact = await createContact(contactData);
    setContacts([newContact, ...contacts]);

    setContactData({
      relation: "parent",
      name: "",
      address: "",
      phone1: "",
      phone2: "",
      email: "",
    });

    setShowContactModal(false);
  };

  /* ================= UI ================= */
  return (
    <div className="profile-page">
      <Container className="py-5">

        {/* PROFILE HEADER */}
        <Card className="profile-header shadow-lg mb-5 position-relative">
  
  {/* SOCIAL DROPDOWN ICON */}
  <div style={{ position: "absolute", top: "16px", right: "16px" }}>
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={
        <Popover className="shadow-lg rounded-4">
          <Popover.Body>

            {socialLinks.length === 0 && (
              <p className="text-muted small text-center">No social links yet</p>
            )}

            {socialLinks.map((s, i) => (
              <div key={i} className="d-flex align-items-center justify-content-between py-2">
                <a href={s.url} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 text-decoration-none">
                  {iconMap[s.platform] || <FaLink />}
                  <span style={{ textTransform: "capitalize", color: "#444" }}>
                    {s.platform}
                  </span>
                </a>

                <FaTrash
                  style={{ cursor: "pointer", color: "#ff4d8d" }}
                  onClick={async () => {
                    const updated = await deleteSocialLink(i);
                    setSocialLinks(updated);
                  }}
                />
              </div>
            ))}

            <hr />

            <Button
              size="sm"
              className="btn-pink w-100"
              onClick={() => setShowSocialModal(true)}
            >
              <FaPlus className="me-2" /> Add Social Link
            </Button>

          </Popover.Body>
        </Popover>
      }
    >
      <Button className="btn-pink-outline rounded-circle">
        <FaLink />
      </Button>
    </OverlayTrigger>
  </div>

  {/* EXISTING CONTENT */}
  <Row className="align-items-center g-4">
    <Col md={3} className="text-center">
      <Image
        src={user.profilePic || "/images/baby.jpg"}
        roundedCircle
        className="profile-avatar"
      />
    </Col>

    <Col md={6}>
      <h2>{user.fullName}</h2>
      <p className="text-muted">Age {user.age}</p>
      <p>{user.bio || "No bio added yet."}</p>
    </Col>
  </Row>
{/* SOCIAL MODAL */}
<Modal show={showSocialModal} onHide={() => setShowSocialModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Social Profile</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form.Select
      className="mb-3"
      value={newSocial.platform}
      onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
    >
      <option value="instagram">Instagram</option>
      <option value="linkedin">LinkedIn</option>
      <option value="github">GitHub</option>
      <option value="facebook">Facebook</option>
      <option value="gmail">Gmail</option>
      <option value="website">Website</option>
    </Form.Select>

    <Form.Control
      placeholder="Paste profile URL"
      value={newSocial.url}
      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
    />
  </Modal.Body>

  <Modal.Footer>
    <Button variant="outline-secondary" onClick={() => setShowSocialModal(false)}>
      Cancel
    </Button>

    <Button
      className="btn-pink"
      onClick={async () => {
        if (!newSocial.url) return;

        const updated = await addSocialLink(newSocial.platform, newSocial.url);
        setSocialLinks(updated);

        setNewSocial({ platform: "instagram", url: "" });
        setShowSocialModal(false);
      }}
    >
      Save
    </Button>
  </Modal.Footer>
</Modal>

</Card>


        {/* FEATURE CARD – CREATE POST */}
        <Card
          className="feature-card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/create-post")}
        >
          <h4 className="fw-bold">Create a Post</h4>
          <p className="text-muted">
            Share your thoughts, stories, or experiences
          </p>
        </Card> <br/> 
<MyPostsSection /> <br/>  
        {/* JOURNALS + CONTACTS */}
        <Row className="g-4">
          {/* JOURNALS */}
          <Col md={6}>
            <Card className="p-4 shadow-sm">
              <h5 className="fw-bold">Journal Entries</h5>
              <Button
                className="btn-pink mb-3"
                onClick={() => setShowJournalModal(true)}
              >
                New Journal Entry
              </Button>

              {journals.length === 0 && (
                <p className="text-muted text-center">
                  No journal entries yet.
                </p>
              )}

              {journals.slice(0, 3).map((j) => (
                <Card key={j._id} className="mb-2">
                <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="fw-bold journal-title" style={{ cursor: "pointer", color: "#ff4d8d" }} onClick={() => setViewingJournal(j)}>{j.title}</h6>
                    <small className="text-muted">
                      {new Date(j.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div> 
                    <Button
                      size="sm" className="btn-del"
                      onClick={() => handleDeleteJournal(j._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                </Card.Body>
                </Card>
             ))}

            </Card>
          </Col>

          {/* CONTACTS */}
          <Col md={6}>
            <Card className="p-4 shadow-sm">
              <h5 className="fw-bold">Emergency Contacts</h5>
              <Button
                className="btn-pink mb-3"
                onClick={() => setShowContactModal(true)}
              >
                Add Contact
              </Button>

              {contacts.map((c) => (
                <Card key={c._id} className="mb-2">
                  <Card.Body>
                    <h6 className="mt-1">{c.name}</h6>
                    <small>
                      {c.relation} · 📞 {c.phone1}
                    </small>
                  </Card.Body>
                </Card>
              ))}
            </Card>
          </Col>
        </Row>

        {/* JOURNAL MODAL */}
        <Modal
          show={showJournalModal}
          onHide={() => setShowJournalModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{editingJournal ? "Edit Journal Entry" : "New Journal Entry"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
  className="mb-2"
  placeholder="Journal title"
  value={journalTitle}
  onChange={(e) => setJournalTitle(e.target.value)}
/>
            <Form.Control
  as="textarea"
  rows={5}
  placeholder="Write privately..."
  value={journalText}
  onChange={(e) => setJournalText(e.target.value)}
/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowJournalModal(false)}>
              Cancel
            </Button>
            <Button className="btn-pink" onClick={saveJournal}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
  show={!!viewingJournal}
  onHide={() => setViewingJournal(null)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>
      {viewingJournal?.title}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
    <p className="text-muted small">
      {viewingJournal?.updatedAt &&
  viewingJournal.updatedAt !== viewingJournal.createdAt && (
    <>
      Last edited:{" "}
      {new Date(viewingJournal.updatedAt).toLocaleString()}
    </>
)}

    </p>

    <div
      style={{
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
        fontSize: "1rem"
      }}
    >
      {viewingJournal?.text}
    </div>
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="outline-secondary"
      onClick={() => setViewingJournal(null)}
    >
      Close
    </Button>

    <Button
      className="btn-pink"
      onClick={() => {
        handleEditJournal(viewingJournal);
        setViewingJournal(null);
      }}
    >
      Edit
    </Button>
  </Modal.Footer>
</Modal>

        {/* CONTACT MODAL */}
        <Modal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Emergency Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              className="mb-2"
              placeholder="Name"
              value={contactData.name}
              onChange={(e) =>
                setContactData({ ...contactData, name: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Relation"
              value={contactData.relation}
              onChange={(e) =>
                setContactData({ ...contactData, relation: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Phone"
              value={contactData.phone1}
              onChange={(e) =>
                setContactData({ ...contactData, phone1: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Email"
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowContactModal(false)}>
              Cancel
            </Button>
            <Button className="btn-pink" onClick={saveContact}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
}

export default Profile;
