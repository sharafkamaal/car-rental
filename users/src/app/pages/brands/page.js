"use client";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import Image from "next/image";

export default function BrandsPage() {
  const [brands, setBrands] = useState([
    { id: 1, name: "Tesla", country: "USA", photo: "/tesla.png" },
    { id: 2, name: "BMW", country: "Germany", photo: "/bmw.png" },
    { id: 3, name: "Toyota", country: "Japan", photo: "/toyota.png" },
  ]);

  const [visible, setVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({ name: "", country: "", photo: "" });

  // Handle Add / Edit
  const saveBrand = () => {
    if (editingBrand) {
      setBrands(
        brands.map((b) =>
          b.id === editingBrand.id ? { ...editingBrand, ...form } : b
        )
      );
    } else {
      setBrands([
        ...brands,
        { id: brands.length + 1, name: form.name, country: form.country, photo: form.photo },
      ]);
    }
    setVisible(false);
    setForm({ name: "", country: "", photo: "" });
    setEditingBrand(null);
  };

  const editBrand = (brand) => {
    setEditingBrand(brand);
    setForm({ name: brand.name, country: brand.country, photo: brand.photo });
    setVisible(true);
  };

  const deleteBrand = (brand) => {
    setBrands(brands.filter((b) => b.id !== brand.id));
  };

  // Preview brand logo
  const photoBody = (rowData) => (
    <Image
      src={rowData.photo || "/no-image.png"}
      alt={rowData.name}
      width={50}
      height={50}
      className="border-circle shadow-1"
    />
  );

  const actionBody = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        size="small"
        onClick={() => editBrand(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        size="small"
        onClick={() => deleteBrand(rowData)}
      />
    </div>
  );

  return (
    <div className="p-4">
      <Card title="Car Rental Brands" className="shadow-2 border-round-xl">
        <div className="flex justify-content-between align-items-center mb-3">
          <h2 className="m-0">Brands</h2>
          <Button
            label="Add Brand"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => setVisible(true)}
          />
        </div>

        <DataTable value={brands} paginator rows={5} stripedRows responsiveLayout="scroll">
          <Column body={photoBody} header="Logo" style={{ width: "100px" }} />
          <Column field="id" header="ID" style={{ width: "10%" }} />
          <Column field="name" header="Brand Name" sortable />
          <Column field="country" header="Country" sortable />
          <Column header="Actions" body={actionBody} />
        </DataTable>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog
        header={editingBrand ? "Edit Brand" : "Add Brand"}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="name" className="block mb-2">Brand Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="country" className="block mb-2">Country</label>
            <InputText
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block mb-2">Upload Logo</label>
            <FileUpload
              mode="basic"
              accept="image/*"
              chooseLabel="Choose"
              customUpload
              uploadHandler={(e) => {
                // For demo: just create a temporary URL
                const file = e.files[0];
                const imgUrl = URL.createObjectURL(file);
                setForm({ ...form, photo: imgUrl });
              }}
            />
            {form.photo && (
              <div className="mt-3">
                <Image src={form.photo} alt="Preview" width={100} height={100} className="border-round" />
              </div>
            )}
          </div>
          <div className="flex justify-content-end gap-2 mt-3">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" onClick={() => setVisible(false)} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveBrand} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
