import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable, CModal, CModalBody, CModalFooter, CModalHeader, CToast, CToastBody, CToastHeader } from "@coreui/react-pro";
import axios from "axios";
import Typography from '@mui/material/Typography'; // Import Typography
import io from "socket.io-client"; // Import socket.io-client

const socket = io("http://localhost:5001"); // Set up socket connection with your backend

const getBadge = (statut) => {
  switch (statut) {
    case "Disponible":
      return "success";
    case "En service":
      return "warning";
    case "En repos":
      return "secondary";
    default:
      return "dark";
  }
};

export const ConducteurSmartTable = ({ onEdit, refreshTable }) => {
  const [details, setDetails] = useState([]);
  const [conducteurs, setConducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chauffeurToDelete, setchauffeurToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Pour afficher le message de succès



  const deleteChauffeur = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      const { data } = await axios.delete(`http://localhost:5001/api/chauffeur/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Véhicule supprimé", data);
  
      // Afficher le message de succès
      setSuccessMessage(data.message);
  
      // Rafraîchir la liste des véhicules après suppression
      fetchConducteurs();
  
      // Fermer le modal après suppression
      setShowModal(false);
  
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage("");  // Effacer le message après 3 secondes
      }, 3000);  // Délai de 3000 millisecondes (3 secondes)
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule :", error);
    }
  };



  const fetchConducteurs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get("http://localhost:5001/api/chauffeur/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Données reçues :", data); // Ajoutez ceci pour voir les données reçues
      setConducteurs(data.chauffeurs || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des conducteurs :", error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchConducteurs();
    }
    
    socket.on("chauffeur:update", (data) => {
      if (data.type === "create") {
        setConducteurs((prev) => [...prev, data.chauffeur]); // Ajouter le chauffeur à la liste sans écraser l'état
      } else if (data.type === "update") {
        setConducteurs((prev) => prev.map((chauffeur) => 
          chauffeur._id === data.chauffeur._id ? data.chauffeur : chauffeur
        ));
      } else if (data.type === "delete") {
        setConducteurs((prev) => prev.filter((chauffeur) => chauffeur._id !== data.id));
      }
    });

    return () => {
      socket.off("chauffeur:update"); // Nettoyer l'écouteur lorsque le composant est démonté
    };
  }, [page, search]);

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prénom" },
    { key: "experience", label: "Expérience (années)" },
    { key: "numero_tel", label: "Téléphone" },
    { key: "statut", label: "Statut" },
    { key: "show_details", label: "", filter: false, sorter: false },
  ];

  const toggleDetails = (id) => {
    setDetails((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <>
    <CSmartTable
      columns={columns}
      items={conducteurs}
      loading={loading}
      pagination
      columnFilter
      columnSorter
      cleaner
      clickableRows
      itemsPerPage={5}
      onPageChange={(page) => setPage(page)}
      scopedColumns={{
        statut: (item) => (
          <td>
            <CBadge color={getBadge(item.statut)}>{item.statut}</CBadge>
          </td>
        ),
        show_details: (item) => (
          <td className="py-2">
            <CButton color="primary" variant="outline" size="sm" onClick={() => toggleDetails(item._id)}>
              {details.includes(item._id) ? "Cacher" : "Voir"}
            </CButton>
          </td>
        ),
        details: (item) => (
          <CCollapse visible={details.includes(item._id)}>
            <div className="p-2">
              {/* <h5 style={{ fontSize: "0.975rem" }}>{item.nom} {item.prenom}</h5> */}
              <p className="text-body-secondary" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                <strong>Numéro CIN :</strong> {item.documents?.cin || "N/A"}<br />
                <strong>Passeport :</strong> {item.documents?.passeport || "N/A"}<br />
                <strong>N° Permis: </strong>{item.permis_numero || "N/A"}<br />
                <strong>Date d'ajout: </strong>{item.date_ajout || "N/A"}
              </p>
               <CButton size="sm" color="info" style={{ fontSize: "0.75rem" }} onClick={() => onEdit(item)}>
                  Modifier
              </CButton>
              <CButton
                  size="sm"
                  color="danger"
                  className="ms-1"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => {
                    setchauffeurToDelete(item._id);
                    setShowModal(true);
                  }}
                >
                  Supprimer                              
              </CButton>
            </div>
          </CCollapse>
        ),
      }}
      noItemsLabel="Aucun conducteur trouvé"
      selectable
      tableFilter
      tableProps={{
        responsive: true,
        striped: true,
        hover: true,
      }}
      tableBodyProps={{
        className: "align-middle",
      }}
    />
     {/* Modal de confirmation */}
     <CModal
     visible={showModal}
     onClose={() => setShowModal(false)}
     alignment="center"
   >
     <CModalHeader>Confirmation de suppression</CModalHeader>
     <CModalBody>
       <Typography>Êtes-vous sûr de vouloir supprimer ce véhicule ?</Typography>
     </CModalBody>
     <CModalFooter>
       <CButton color="secondary" onClick={() => setShowModal(false)}>
         Annuler
       </CButton>
       <CButton color="danger" onClick={() => deleteChauffeur(chauffeurToDelete)}>
         Supprimer
       </CButton>
     </CModalFooter>
   </CModal>

   {/* Affichage du message de succès */}
   {successMessage && (
     <CToast color="success" className="text-white">
       <CToastHeader closeButton>Succès</CToastHeader>
       <CToastBody>{successMessage}</CToastBody>
     </CToast>
   )}
 </>
  );
};
