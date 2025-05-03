// components/NoteModal.js
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const NoteModal = ({ show, handleClose, handleSubmit, note, setNote, actionLabel }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Ghi chú xác minh</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="noteTextarea">
          <Form.Label>Nhập ghi chú (tuỳ chọn)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Hủy
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        {actionLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default NoteModal;
