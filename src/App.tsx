import { useState } from "react";
import {
  addPocketItem,
  deletePocketItem,
  updatePocketItem
} from "./db/pocketItemsDb";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemFormPage from "./pages/ItemFormPage";
import ItemListPage from "./pages/ItemListPage";
import type { PocketItem, PocketItemInput } from "./types/PocketItem";

type AppView =
  | {
      name: "list";
    }
  | {
      name: "detail";
      itemId: string;
    }
  | {
      name: "add";
    }
  | {
      name: "edit";
      item: PocketItem;
    };

export default function App() {
  const [view, setView] = useState<AppView>({ name: "list" });
  const [saveMessage, setSaveMessage] = useState("");

  if (view.name === "detail") {
    return (
      <ItemDetailPage
        itemId={view.itemId}
        saveMessage={saveMessage}
        onClearSaveMessage={() => setSaveMessage("")}
        onBack={() => setView({ name: "list" })}
        onEdit={(item) => setView({ name: "edit", item })}
        onDelete={async (itemId) => {
          await deletePocketItem(itemId);
          setView({ name: "list" });
        }}
      />
    );
  }

  if (view.name === "add") {
    return (
      <ItemFormPage
        mode="add"
        onBack={() => setView({ name: "list" })}
        onSubmit={async (input: PocketItemInput) => {
          await addPocketItem(input);
          setSaveMessage("保存しました。");
          setView({ name: "list" });
        }}
      />
    );
  }

  if (view.name === "edit") {
    return (
      <ItemFormPage
        mode="edit"
        initialItem={view.item}
        onBack={() => setView({ name: "detail", itemId: view.item.id })}
        onSubmit={async (input: PocketItemInput) => {
          await updatePocketItem(view.item.id, input);
          setSaveMessage("保存しました。");
          setView({ name: "detail", itemId: view.item.id });
        }}
      />
    );
  }

  return (
    <ItemListPage
      saveMessage={saveMessage}
      onClearSaveMessage={() => setSaveMessage("")}
      onSelectItem={(itemId) => setView({ name: "detail", itemId })}
      onAddItem={() => setView({ name: "add" })}
    />
  );
}
