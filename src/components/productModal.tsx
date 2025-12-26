import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
} from "flowbite-react";

interface Product {
  id: number;
  code: string;
  name: string;
  subcategory_id: number;
  price: string;
  manufacture_id: number;
  import_company_id: number;
  isStockLow: boolean;
  minimum: number;
  image: string;
  quantity?: number;
  cost_price?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSuccess: () => void;
}

function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  onSuccess,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price: "",
    subcategory_id: "",
    manufacture_id: "",
    import_company_id: "",
    minimum: "10",
    quantity: "0",
    cost_price: "",
    image: "",
  });

  const [subcategories, setSubcategories] = useState<
    { id: number; name: string }[]
  >([]);
  const [manufacturers, setManufacturers] = useState<
    { id: number; name: string }[]
  >([]);
  const [importCompanies, setImportCompanies] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [subRes, manRes, impRes] = await Promise.all([
            api.get("/subcategories"),
            api.get("/manufacturers"),
            api.get("/import-companies"),
          ]);
          setSubcategories(subRes.data);
          setManufacturers(manRes.data);
          setImportCompanies(impRes.data);
        } catch (err) {
          console.error("Failed to fetch dropdown data", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        code: editingProduct.code,
        price: String(editingProduct.price),
        subcategory_id: String(editingProduct.subcategory_id),
        manufacture_id: String(editingProduct.manufacture_id),
        import_company_id: String(editingProduct.import_company_id),
        minimum: String(editingProduct.minimum),
        quantity: String(editingProduct.quantity),
        cost_price: String(editingProduct.cost_price),
        image: editingProduct.image || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        price: "",
        subcategory_id: "",
        manufacture_id: "",
        import_company_id: "",
        minimum: "10",
        quantity: "0",
        cost_price: "",
        image: "",
      });
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      subcategory_id: parseInt(formData.subcategory_id),
      manufacture_id: parseInt(formData.manufacture_id),
      import_company_id: parseInt(formData.import_company_id),
      minimum: parseInt(formData.minimum),
      quantity: parseInt(formData.quantity),
      cost_price: formData.cost_price
        ? parseFloat(formData.cost_price)
        : undefined,
    };

    try {
      if (editingProduct) {
        await api.put(`products/${editingProduct.id}`, dataToSubmit);
      } else {
        await api.post(`products`, dataToSubmit);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Submit failed", err);
    }
  };

  const inputFix = "[&_input]:!text-black [&_input]:!bg-white";
  const selectFix = "[&_select]:!text-black [&_select]:!bg-white";

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader className="bg-slate-900 border-slate-800">
        <span className="text-white">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </span>
      </ModalHeader>
      <ModalBody className="bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-slate-300">Product Name</Label>
              <TextInput
                className={inputFix}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="text-slate-300">Code</Label>
              <TextInput
                className={inputFix}
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="text-slate-300">Price</Label>
              <TextInput
                className={inputFix}
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="text-slate-300">Subcategory</Label>
              <Select
                className={selectFix}
                value={formData.subcategory_id}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory_id: e.target.value })
                }
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Manufacture</Label>
              <Select
                className={selectFix}
                value={formData.manufacture_id}
                onChange={(e) =>
                  setFormData({ ...formData, manufacture_id: e.target.value })
                }
                required
              >
                <option value="">Select Manufacture</option>
                {manufacturers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Import Company</Label>
              <Select
                className={selectFix}
                value={formData.import_company_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    import_company_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Company</option>
                {importCompanies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Minimum Amount</Label>
              <TextInput
                className={inputFix}
                type="number"
                value={formData.minimum}
                onChange={(e) =>
                  setFormData({ ...formData, minimum: e.target.value })
                }
                required
              />
            </div>

            {editingProduct ? null : (
              <>
                <div>
                  <Label className="text-slate-300">Quantity</Label>
                  <TextInput
                    className={inputFix}
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Cost Price</Label>
                  <TextInput
                    className={inputFix}
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_price: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <Label className="text-slate-300">Image URL</Label>
              <TextInput
                className={inputFix}
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button className="p-3 bg-gray-500" onClick={onClose}>
              Cancel
            </Button>
            <Button className="p-3 bg-blue-600" type="submit">
              {editingProduct ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default ProductModal;
