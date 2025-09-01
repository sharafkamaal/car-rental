"use client";
import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function renderAction(role, user, onEdit) {
    if (role === "Admin") {
        return (
            <Button
                label="Edit"
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                aria-label="Edit"
                onClick={() => onEdit(user)}
                className="p-button-sm"
            />
        );
    }
    return null;
}

export default function UsersPage() {
    // ✅ keep users in state so we can add new ones
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", username: "johnny", role: "Customer" },
        { id: 2, name: "Jane Smith", username: "janes", role: "Admin" },
        { id: 3, name: "Mike Brown", username: "mikeb", role: "Customer" },
        { id: 4, name: "Marry Hat", username: "marryh", role: "Admin" },
    ]);

    const [visibleRight, setVisibleRight] = useState(false);

    // form states (Add User)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(null);

    // edit states
    const [editVisible, setEditVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editName, setEditName] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editRole, setEditRole] = useState(null);

    const roleOptions = [
        { label: "Mechanic", value: "Mechanic" },
        { label: "Manager", value: "Manager" },
        { label: "Admin", value: "Admin" },
        { label: "Super Admin", value: "Super Admin" },
    ];

    const handleSubmit = () => {
        if (!name || !email || !role) {
            alert("Please fill all fields");
            return;
        }

        const newUser = {
            id: users.length + 1,
            name,
            username: email.split("@")[0], // auto-generate username from email
            role,
        };

        setUsers([...users, newUser]);

        // reset form + close sidebar
        setName("");
        setEmail("");
        setRole(null);
        setVisibleRight(false);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditUsername(user.username);
        setEditRole(user.role);
        setEditVisible(true);
    };

    const saveEdit = () => {
        if (!editingUser) return;
        if (!editName || !editUsername || !editRole) {
            alert("Please fill all fields");
            return;
        }

        setUsers((prev) =>
            prev.map((u) =>
                u.id === editingUser.id
                    ? { ...u, name: editName, username: editUsername, role: editRole }
                    : u
            )
        );

        setEditVisible(false);
        setEditingUser(null);
    };

    const cancelEdit = () => {
        setEditVisible(false);
        setEditingUser(null);
    };

    // Action column template for DataTable
    const actionBodyTemplate = (rowData) => {
        return renderAction(rowData.role, rowData, openEdit);
    };

    return (
        <div style={{ padding: "2rem", position: "relative" }}>
            {/* Add User Button */}
            <Button
                label="Add User"
                onClick={() => setVisibleRight(true)}
                className="p-button-success"
                style={{
                    position: "absolute",
                    top: "0rem",
                    right: "2rem",
                    fontWeight: "bold",
                    fontSize: "16px",
                }}
            />

            {/* Sidebar with Add User Form */}
            <Sidebar
                visible={visibleRight}
                position="right"
                onHide={() => setVisibleRight(false)}
            >
                <h2 className="mb-4">Add User</h2>

                <div className="p-fluid flex flex-column gap-3">
                    <span className="p-float-label">
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="name">Name</label>
                    </span>

                    <span className="p-float-label">
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                    </span>

                    <span className="p-float-label">
                        <Dropdown
                            id="role"
                            value={role}
                            options={roleOptions}
                            onChange={(e) => setRole(e.value)}
                            placeholder="Select Role"
                        />
                        <label htmlFor="role">Role</label>
                    </span>

                    <Button
                        label="Save User"
                        onClick={handleSubmit}
                        className="p-button-success mt-3"
                    />
                </div>
            </Sidebar>

            {/* Edit User Sidebar */}
            <Sidebar
                visible={editVisible}
                position="right"
                onHide={cancelEdit}
            >
                <h2 className="mb-4">Edit User</h2>
                <div className="p-fluid flex flex-column gap-3">
                    <span className="p-float-label">
                        <InputText
                            id="edit-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                        <label htmlFor="edit-name">Name</label>
                    </span>

                    <span className="p-float-label">
                        <InputText
                            id="edit-username"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                        />
                        <label htmlFor="edit-username">Username</label>
                    </span>

                    <span className="p-float-label">
                        <Dropdown
                            id="edit-role"
                            value={editRole}
                            options={roleOptions}
                            onChange={(e) => setEditRole(e.value)}
                            placeholder="Select Role"
                        />
                        <label htmlFor="edit-role">Role</label>
                    </span>

                    <div className="flex gap-2 mt-3">
                        <Button label="Cancel" className="p-button-secondary" onClick={cancelEdit} />
                        <Button label="Save Changes" className="p-button-success" onClick={saveEdit} />
                    </div>
                </div>
            </Sidebar>

            <h1>Users</h1>

            {/* PrimeReact DataTable replacing the HTML table */}
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="username" header="Username"></Column>
                <Column field="role" header="Role"></Column>
                <Column header="Action" body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}
