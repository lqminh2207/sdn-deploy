import { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Paginate from "../components/Paginate";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Productlist = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [categoryId, setCategoryId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:9999/brands")
      .then((res) => res.data)
      .then((data) => {
        setBrands(data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9999/categories")
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const fetchProducts = (page) => {
    let url = `http://localhost:9999/products?page=${page}`;

    if (nameSearch) {
      url += `&name=${nameSearch}`;
    }

    if (statusFilter) {
      url += `&status=${statusFilter}`;
    }

    if (categoryId) {
      url += `&category=${categoryId}`;
    }

    console.log("url");
    console.log(url);
    axios(url)
      .then((res) => {
        console.log("res");
        console.log(res);
        setTotalPages(res.data.totalPages);
        setProducts(res.data.docs);
      })
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, nameSearch, statusFilter, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId);
      }
    });
  };

  const deleteProduct = (productId) => {
    axios
      .delete(`http://localhost:9999/products/${productId}`)
      .then((res) => {
        fetchProducts(currentPage);
        toast.success("Product deleted successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const changeStatus = (productId, status) => {
    axios
      .patch(`http://localhost:9999/products/${productId}`, {
        status: !status,
      })
      .then((res) => {
        fetchProducts(currentPage);
        toast.success("Change status successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
    // fetch(`http://localhost:9999/products/${productId}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     status: !status,
    //   }),
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((res) => {
    //     if (res.ok) {
    //       fetchProducts(currentPage);
    //       toast.success("Change status successfully");
    //     } else {
    //       toast.error("Failed to change status");
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(error.message);
    //   });
  };

  const changeFeatured = (productId, featured) => {
    axios
      .patch(`http://localhost:9999/products/${productId}`, {
        featured: !featured,
      })
      .then((res) => {
        fetchProducts(currentPage);
        toast.success("Change feature successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Col lg={12}>
      <h3 className="mt-2">Contacts List</h3>
      <Row className="my-4">
        <Col xs={12} md={4}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="name"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">Select status</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={2} style={{ textAlign: "right" }}>
          <Button variant="primary">
            <Link className="text-white" to={"/admin/product/add-product"}>
              Add Product
            </Link>
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Original Price</th>
            <th>Category</th>
            <th>Brand</th>
            <th className="text-center">Status</th>
            <th className="text-center">Feature</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((p) => {
              const nameMatches =
                !nameSearch ||
                p.name.toLowerCase().includes(nameSearch.toLowerCase());
              return nameMatches;
            })
            .map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                    src={p.images[0]}
                  />{" "}
                  {p.name}
                </td>
                <td>$ {p.price}</td>
                <td>$ {p.originalPrice}</td>
                <td>
                  {p.category?.name || ''}
                </td>
                <td>
                  {p.brand?.name || ''}
                </td>
                <td className="text-center">
                  {p.status === true ? (
                    <Badge
                      bg="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeStatus(p._id, p.status)}
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      bg="warning"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeStatus(p._id, p.status)}
                    >
                      Inactive
                    </Badge>
                  )}
                </td>
                <td className="text-center">
                  {p.featured === true ? (
                    <Badge
                      bg="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeFeatured(p._id, p.featured)}
                    >
                      Yes
                    </Badge>
                  ) : (
                    <Badge
                      bg="warning"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeFeatured(p._id, p.featured)}
                    >
                      No
                    </Badge>
                  )}
                </td>
                <td className="text-center">
                  <Button variant="primary">
                    <Link className="text-white" to={"/admin/product/" + p._id}>
                      View
                    </Link>
                  </Button>
                  <Button variant="primary" className="mx-2">
                    <Link
                      className="text-white"
                      to={"/admin/product/edit/" + p._id}
                    >
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div className="pagination mb-3 justify-content-end">
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      </div>
    </Col>
  );
};

export default Productlist;
