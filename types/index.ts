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
  parentId: string;
  type: 'options';
  position: "userA" | "userB";
  editType?: "add" | "edit" | "view";
  cancel?: object;
  options: [{
    name: string;
    schemeId: string | undefined;
  }]; // Array of flowScheme id's
}

export interface flowSchemeCommunication {
  id: string;
  parentId: string ;
  type: 'communication';
  position: "userA" | "userB";
  editType?: "add" | "edit" | "view";
  cancel?: object;
  content: string;
}

export interface flowSchemeInfo {
  id: string;
  parentId: string;
  type: 'info';
  editType?: "add" | "edit" | "view";
  position: "userA" | "userB" | "both";
  cancel?: object;
  content: string;
}