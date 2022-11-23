export interface ToggleOptions {
  id: string;
  name: string;
  color?: string; // HEX
}

export interface flowObject {
  _id: string; // Hex
  _rev?: string; // Hex
  name: string;
  userA: string;
  userB: string;
  interaction: string;
  scheme: [flowScheme];
}

export interface flowScheme {
  type: 'option' | 'communication' | 'info';
  details: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo;
}

export interface flowSchemeOption {
  parentId: string;
  options: [
    {
      id: string;
      name: string;
    }
  ]
}

export interface flowSchemeCommunication {
  id: string;
  parentId: string;
  position: "userA" | "userB";
  content: string;
}

export interface flowSchemeInfo {
  id: string;
  parentId: string;
  content: string;
  position: "userA" | "userB" | "both";

}