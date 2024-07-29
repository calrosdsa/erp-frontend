import { Divider, Dropdown, IconButton, Menu, MenuButton, MenuItem } from "@mui/joy";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

export const RowMenu= ({
    onDelete,onMove,onEdit
}:{
    onDelete?:()=>void
    onMove?:()=>void
    onEdit?:()=>void
}) =>{
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        {onEdit != undefined &&
        <MenuItem>Edit</MenuItem>
        }
        {/* <MenuItem>Rename</MenuItem> */}
        {onMove != undefined &&
        <MenuItem>Move</MenuItem>
        }
        {onDelete != undefined &&
        <>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
        </>
        }
      </Menu>
    </Dropdown>
  );
}
