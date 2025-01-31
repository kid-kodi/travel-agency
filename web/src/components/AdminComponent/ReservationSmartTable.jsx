import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from "@coreui/react-pro";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'

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
    }
  }, [page, search]);

  const columns = [
    { key: "departureCity", label: "Départ" },
    { key: "arrivalCity", label: "Arrivée" },
    { key: "date", label: "Date" },
    { key: "tarif", label: "Tarif (€)" },
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
      {/* <input
        type="text"
        placeholder="Rechercher une ville..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "40%", padding: "5px", borderRadius: "5px" }}
      /> */}
      <CSmartTable
        columns={columns}
        items={reservations}
        loading={loading}
        pagination
        columnFilter
        columnSorter
        cleaner
        footer
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
              <div className="p-3">
                <h4>{item.departureCity} → {item.arrivalCity}</h4>
                <p className="text-body-secondary">Réservé le : {new Date(item.dateReservation).toLocaleDateString()}</p>
                <CButton size="sm" color="info">
                  Modifier
                </CButton>
                <CButton size="sm" color="danger" className="ms-1">
                  Supprimer
                </CButton>
              </div>
            </CCollapse>
          ),
        }}

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
