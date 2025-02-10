import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from "@coreui/react-pro";
import { CPagination, CPaginationItem } from "@coreui/react";
import axios from "axios";
import io from "socket.io-client"; // Import socket.io-client

const socket = io("http://localhost:5001"); // Set up socket connection with your backend

const getBadge = (status) => {
  switch (status) {
    case "succeeded":
      return "success";
    case "en attente":
      return "warning";
    case "annulé":
      return "danger";
    default:
      return "secondary";
  }
};

export const ReservationSmartTable = () => {
  const [details, setDetails] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;

  // Fetch reservations with Bearer token
  const fetchReservations = async (page = 1) => {
    setLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      const { data } = await axios.get(`http://localhost:5001/api/reservation/all?page=${page}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setReservations(data.reservations || []);
      setPages(data.totalPages || 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  
    setLoading(false);
  };
  
  //pagination
 const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= pages) {
    setPage(newPage);
  }
};
  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchReservations(page); // Charge les réservations si un token est présent
  
      const handleSocketUpdate = (data) => {
        if (data.type === "create") {
          setReservations((prevReservations) => [data.reservation, ...prevReservations]);
        } else if (data.type === "update") {
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation._id === data.reservation._id ? data.reservation : reservation
            )
          );
        } else if (data.type === "delete") {
          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation._id !== data.id)
          );
        }
      };
  
      socket.on("reservation:update", handleSocketUpdate);
  
      return () => {
        socket.off("reservation:update", handleSocketUpdate); // Nettoyage avec la fonction exacte
      };
    }
  }, [page, search, socket]); // Si socket est une dépendance dynamique
  

  const columns = [
    { key: "departureCity", label: "Départ" },
    { key: "arrivalCity", label: "Arrivée" },
    { key: "date", label: "Date" },
    { key: "tarif", label: "Tarif (XOF)" },
    { key: "horaire", label: "Horaire" },
    { key: "seatNumber", label: "Siège" },
    { key: "paymentStatus", label: " Paiement" },
    { key: "show_details", label: "", filter: false, sorter: false },
  ];

  const toggleDetails = (id) => {
    setDetails((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <CSmartTable
        columns={columns}
        items={reservations}
        loading={loading}
        pagination
        columnFilter
        columnSorter
        cleaner
        itemsPerPage={5}
        activePage={page}
        onPageChange={(newPage) => handlePageChange(newPage)}
        onFilteredItemsChange={(items) => {
          console.log("onFilteredItemsChange");
          console.table(items);
        }}
        onSelectedItemsChange={(items) => {
          console.log("onSelectedItemsChange");
          console.table(items);
        }}
        scopedColumns={{
          date: (item) => (
            <td>
              {new Date(item.date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </td>
          ),
          paymentStatus: (item) => (
            <td>
              <CBadge color={getBadge(item.paymentStatus)}>{item.paymentStatus}</CBadge>
            </td>
          ),
          show_details: (item) => (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                size="sm"
                onClick={() => toggleDetails(item._id)}
              >
                {details.includes(item._id) ? "Cacher" : "Voir"}
              </CButton>
            </td>
          ),
          details: (item) => (
            <CCollapse visible={details.includes(item._id)}>
              <div className="p-2">
                <h5 style={{ fontSize: "0.975rem" }}>
                  {item.departureCity} → {item.arrivalCity}
                </h5>
                <p
                  className="text-body-secondary"
                  style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}
                >
                  Réservé le : <strong>{new Date(item.dateReservation).toLocaleDateString()}</strong>{" "}
                  par {item.user ? `${item.user.firstName} ${item.user.lastName}` : "Non disponible"}
                </p>
                <CButton size="sm" color="info" style={{ fontSize: "0.75rem" }}>
                  Modifier
                </CButton>
                <CButton size="sm" color="danger" className="ms-1" style={{ fontSize: "0.75rem" }}>
                  Supprimer
                </CButton>
              </div>
            </CCollapse>
          ),
        }}
        noItemsLabel="Donnée non disponible"
        selectable
        sorterValue={{ column: "status", state: "asc" }}
        tableFilter
        tableProps={{
          className: "add-this-custom-class",
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: "align-middle",
        }}
      />
  
      {/* Pagination personnalisée avec CoreUI */}
        <div className="d-flex justify-content-center my-3">
          <CPagination aria-label="Page navigation example">
            <CPaginationItem
              aria-label="Previous"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>

            {[...Array(pages)].map((_, index) => (
              <CPaginationItem
                key={index + 1}
                active={page === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              aria-label="Next"
              disabled={page === pages}
              onClick={() => handlePageChange(page + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
    </>
  );  
};
