import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from "@coreui/react-pro";
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

  // Fetch reservations with Bearer token
  const fetchReservations = async () => {
    setLoading(true);

    // Récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem("token");
   
    try {
      // Effectuer la requête GET avec le token dans l'en-tête Authorization
      const { data } = await axios.get("http://localhost:5001/api/reservation/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajout du token Bearer
        },
      });
      console.log("Données token :", token);
      console.log("Données reçues :", data);
      setReservations(data.reservations || []);
      setPages(data.pages || 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchReservations(); // Charge les réservations si un token est présent
  
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
        // footer
        clickableRows
        itemsPerPage={5}
        onPageChange={(page) => setPage(page)}
        onFilteredItemsChange={(items) => {
          console.log('onFilteredItemsChange')
          console.table(items)
        }}
        onSelectedItemsChange={(items) => {
          console.log('onSelectedItemsChange')
          console.table(items)
        }}
        scopedColumns={{
          date: (item) => (
            <td>{new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</td>
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
              <h5 style={{ fontSize: "0.975rem" }}>{item.departureCity} → {item.arrivalCity}</h5>
              <p className="text-body-secondary" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                Réservé le : <strong>{new Date(item.dateReservation).toLocaleDateString()}</strong> par {item.user ? `${item.user.firstName} ${item.user.lastName}` : "Non disponible"}
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
        sorterValue={{ column: 'status', state: 'asc' }}
        tableFilter
        tableProps={{
          className: 'add-this-custom-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
       
      />
    </>
  );
};
