import { MoreHoriz, Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";

export default function KanbanHeader(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
    };

    const handleAdd = async (e) => {
        props.handleAddClick(props.ind);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.handleEditClick(props.job, props.ind);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.handleDeleteClick(props.job, props.ind);
    };

    return (
        <div
            className="flex flex-row self-stretch gap-2 flex-1 max-h-[3rem]"
            style={{
                borderTop: `4px solid ${props.color || "#676767"}`,
                padding: "8px",
                paddingLeft: "16px",
                textAlign: "center",
                fontSize: 20,
                boxShadow: "0px 5px 14px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                background: "white",
                margin: "0 1em",
            }}
        >
            <span>{props.name}</span>
            <div
                style={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "16px",
                    display: "flex",
                    padding: "4px",
                    justifyContent: "center",
                }}
            >
                <span
                    className="flex items-center text-center"
                    style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        letterSpacing: "0.04em",
                        color: "#757575",
                    }}
                >
                    {props.amount}
                </span>
            </div>
            <IconButton
                onClick={handleAdd}
                style={{ marginLeft: "auto" }}
                sx={{
                    flexShrink: 1,
                    padding: 0,
                }}
            >
                <Add />
            </IconButton>
            <IconButton
                onClick={handleMenuOpen}
                sx={{
                    flexShrink: 1,
                    padding: 0,
                }}
            >
                <MoreHoriz />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onCclick={handleDelete}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
