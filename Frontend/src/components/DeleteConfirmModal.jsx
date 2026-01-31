import { Modal, Button } from "react-bootstrap";

function DeleteConfirmModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete this post? This action cannot be undone.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button className="btn-del" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;

