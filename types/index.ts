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
  parentId: string | undefined;
  cancel?: object;
  type: 'option';
  options: [
    {
      id: string;
      name: string;
    }
  ]
  editType?: "add" | "edit" | "view";
}

export interface flowSchemeCommunication {
  id: string;
  cancel?: object;
  type: 'communication';
  parentId: string | undefined;
  position: "userA" | "userB";
  content: string;
  editType?: "add" | "edit" | "view";
}

export interface flowSchemeInfo {
  id: string;
  cancel?: object;
  type: 'info';
  parentId: string | undefined;
  content: string;
  position: "userA" | "userB" | "both";
  editType?: "add" | "edit" | "view";
}