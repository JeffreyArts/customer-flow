export interface ToggleOptions {
  id: string;
  name: string;
  selected: boolean;
  color?: string; // HEX
  bgcolor?: string; // HEX
}

export interface flowObject {
  _id?: string; // Hex
  _rev?: string; // Hex
  userA: string;  
  userB: string;
  interaction: string;
  description?: string;
  scheme: [flowSchemeOption | flowSchemeCommunication | flowSchemeInfo];
}


export interface flowSchemeOption {
  id: string;
  parentId: string | undefined;
  type: 'option';
  editType?: "add" | "edit" | "view";
  cancel?: object;
  options: [
    {
      id: string;
      name: string;
    }
  ]
}

export interface flowSchemeCommunication {
  id: string;
  parentId: string | undefined;
  type: 'communication';
  editType?: "add" | "edit" | "view";
  cancel?: object;
  position: "userA" | "userB";
  content: string;
}

export interface flowSchemeInfo {
  id: string;
  parentId: string | undefined;
  type: 'info';
  editType?: "add" | "edit" | "view";
  cancel?: object;
  content: string;
  position: "userA" | "userB" | "both";
}