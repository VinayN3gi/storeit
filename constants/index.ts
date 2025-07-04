export const navItems=[
    {name:"Dashboard",icon:"/assets/icons/dashboard.svg",url:"/home"},
    {name:"Documents",icon:"assets/icons/documents.svg",url:"/documents"},
    {name:"Images",icon:"assets/icons/images.svg",url:"/images"},
    {name:"Media",icon:"assets/icons/video.svg",url:"/media"},
    {name:"Others",icon:"assets/icons/others.svg",url:"/others"}
]


export const actionsDropdownItems = [
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; 