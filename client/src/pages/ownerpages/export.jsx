import React from "react";
import ReactExport from "react-export-excel";
import VerticalAlignBottomSharpIcon from "@material-ui/icons/VerticalAlignBottomSharp";
import { Button } from "@material-ui/core";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const BuildingToExcel = ({ dynamicSearch }) => {
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={dynamicSearch} name="Building">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Nbr d'appartement" value="numberofAppart" />
        <ExcelColumn label="Nbr d'appartement occupé" value="counter" />
        <ExcelColumn label="Adresse" value="adress" />
        <ExcelColumn label="Code postale" value="postalcode" />
        <ExcelColumn label="Ville" value="city" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const AppartToExcel = ({ dynamicSearch }) => {
  const data = dynamicSearch.map((data) => {
    return {
      _id: data._id,
      adress: data.building ? data.building.adress : data.adress,
      postalcode: data.building ? data.building.postalcode : data.postalcode,
      city: data.building ? data.building.city : data.city,
      status: data.status,
      size: data.size,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={data} name="Appart">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Adresse" value="adress" />
        <ExcelColumn label="Code postale" value="postalcode" />
        <ExcelColumn label="Ville" value="city" />
        <ExcelColumn label="Pièces" value="size" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const TenantToExcel = ({ dynamicSearch }) => {
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={dynamicSearch} name="Tenants">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Nom" value="lastname" />
        <ExcelColumn label="Prénom" value="name" />
        <ExcelColumn label="Email" value="email" />
        <ExcelColumn label="Date de naissance" value="dateofbirth" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const ContractToExcel = ({ dynamicSearch }) => {
  const data = dynamicSearch.map((data) => {
    return {
      _id: data._id,
      tenant: `${data.tenant.name} ${data.tenant.lastname}`,
      adress: data.appartmentid.building
        ? data.appartmentid.building.adress
        : data.appartmentid.adress,
      postalcode: data.appartmentid.building
        ? data.appartmentid.building.postalcode
        : data.appartmentid.postalcode,
      city: data.appartmentid.building
        ? data.appartmentid.building.city
        : data.appartmentid.city,
      status: data.status,
      charge: data.charge,
      other: data.other,
      rent: data.rent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={data} name="Appart">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Locataire" value="tenant" />
        <ExcelColumn label="Adresse" value="adress" />
        <ExcelColumn label="Code postale" value="postalcode" />
        <ExcelColumn label="Ville" value="city" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Charge" value="charge" />
        <ExcelColumn label="Loyer" value="rent" />
        <ExcelColumn label="Autres informations" value="other" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const BillToExcel = ({ dynamicSearch }) => {
  const data = dynamicSearch.map((data) => {
    return {
      _id: data._id,
      tenant: `${data.tenant.name} ${data.tenant.lastname}`,
      reference: data.reference,
      status: data.status.name,
      amount: data.amount,
      endDate: data.endDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={data} name="Appart">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Locataire" value="tenant" />
        <ExcelColumn label="Réference" value="reference" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Montant" value="amount" />
        <ExcelColumn label="Echeance" value="endDate" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const RepairToExcel = ({ dynamicSearch }) => {
  const data = dynamicSearch.map((data) => {
    return {
      _id: data._id,
      task_title: data.taskid.title,
      task_content: data.taskid.content,
      amount: data.amount,
      status: data.status.name,
      reason: data.reason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={data} name="Appart">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Tâche_titre" value="task_title" />
        <ExcelColumn label="Tâche_contenu" value="task_content" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Montant" value="amount" />
        <ExcelColumn label="Raison" value="reason" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export const TaskToExcel = ({ dynamicSearch }) => {
  const data = dynamicSearch.map((data) => {
    return {
      _id: data._id,
      title: data.title,
      content: data.content,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
  return (
    <ExcelFile
      element={
        <Button>
          <VerticalAlignBottomSharpIcon /> EXPORT
        </Button>
      }
    >
      <ExcelSheet data={data} name="Appart">
        <ExcelColumn label="_id" value="_id" />
        <ExcelColumn label="Titre" value="title" />
        <ExcelColumn label="Contenu" value="content" />
        <ExcelColumn label="Statut" value="status" />
        <ExcelColumn label="Début" value="startDate" />
        <ExcelColumn label="Fin" value="endDate" />
        <ExcelColumn label="Créé le" value="createdAt" />
        <ExcelColumn label="Dernière modification" value="updatedAt" />
      </ExcelSheet>
    </ExcelFile>
  );
};
