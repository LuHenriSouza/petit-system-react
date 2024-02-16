import {
  Fab,
  Box,
  Icon,
  Grid,
  Table,
  Paper,
  Alert,
  Button,
  Dialog,
  useTheme,
  TableRow,
  TextField,
  TableCell,
  TableHead,
  TableBody,
  Pagination,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import { useDebounce } from "../../shared/hooks";
import { LayoutMain } from "../../shared/layouts";
import { useSearchParams } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useMemo, useState } from "react";
import { IGroup, IProduct, GroupService, ProductService } from "../../shared/services/api";

const PROD_ROW_LIMIT = 7;
const GROUP_ROW_LIMIT = 5;
const PRODGROUP_ROW_LIMIT = 5;

export const Groups: React.FC = () => {
  const { debounce } = useDebounce();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  //ADD MODAL
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setProdSelected(0);
    setErrorExists(false);
    setSearchParams((old) => {
      old.delete("prodPage");
      old.delete("prodSearch");
      return old;
    });
  };

  // Groups
  const [groupNameInput, setGroupNameInput] = useState("");
  const [groupRows, setGroupRows] = useState<IGroup[]>([]);
  const [groupTotalCount, setGroupTotalCount] = useState(0);
  const [groupSelectedRow, setGroupSelectedRow] = useState(0);
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);

  const groupSearch = useMemo(() => {
    return searchParams.get("groupSearch") || "";
  }, [searchParams]);

  const groupPage = useMemo(() => {
    return searchParams.get("groupPage") || 1;
  }, [searchParams]);

  useEffect(() => {
    debounce(() => {
      listGroups();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupSearch, groupPage, debounce]);

  const listGroups = async () => {
    const response = await GroupService.getAll(
      Number(groupPage),
      groupSearch,
      GROUP_ROW_LIMIT
    );
    if (response instanceof Error) return alert(response.message);
    setGroupRows(response.data);
    setGroupTotalCount(response.totalCount);
  };

  // Prod In Group
  const [prodGroupRows, setProdGroupRows] = useState<IProduct[]>([]);
  const [prodGroupTotalCount, setProdGroupTotalCount] = useState(0);
  const [NAProd, setNAProd] = useState(true);

  const prodInGroupSearch = useMemo(() => {
    return searchParams.get("prodInGroupSearch") || "";
  }, [searchParams]);

  const prodInGroupPage = useMemo(() => {
    return searchParams.get("prodInGroupPage") || 1;
  }, [searchParams]);

  useEffect(() => {
    if (groupSelectedRow) {
      setNAProd(false);
      listProdsInGroup();
    } else {
      setNAProd(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodInGroupSearch, prodInGroupPage, debounce, groupSelectedRow]);

  const listProdsInGroup = async () => {
    const response = await GroupService.getProdsByGroup(
      groupSelectedRow,
      Number(prodInGroupPage),
      prodInGroupSearch,
      PRODGROUP_ROW_LIMIT
    );
    if (response instanceof Error) return alert(response.message);
    setProdGroupRows(response.data);
    setProdGroupTotalCount(response.totalCount);
    setCheckBoxStatus(response.show);
  };

  // Products
  const [prodRows, setProdRows] = useState<IProduct[]>([]);
  const [prodTotalCount, setProdTotalCount] = useState(0);
  const [prodSelected, setProdSelected] = useState(0);
  const [errorExists, setErrorExists] = useState(false);
  const prodSearch = useMemo(() => {
    return searchParams.get("prodSearch") || "";
  }, [searchParams]);
  const prodPage = useMemo(() => {
    return searchParams.get("prodPage") || 1;
  }, [searchParams]);

  useEffect(() => {
    if (open) {
      listProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prodPage, prodSearch]);

  const listProducts = async () => {
    await ProductService.getAll(
      Number(prodPage),
      prodSearch,
      PROD_ROW_LIMIT
    ).then((result) => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setProdRows(result.data);
        setProdTotalCount(result.totalCount);
      }
    });
  };

  // Group Handles
  const handleNewGroup = async () => {
    const response = await GroupService.create({ name: groupNameInput.trim() });
    if (response instanceof Error) {
      Swal.fire({
        icon: "error",
        title: "Nome muito pequeno !",
        showConfirmButton: false,
        timer: 1000,
      });
      listGroups();
    } else {
      Swal.fire({
        icon: "success",
        title: "Grupo Criado com sucesso!",
        showConfirmButton: false,
        timer: 1000,
      });
      listGroups();
      setGroupNameInput("");
    }
  };

  const handleDeleteGroup = async (id: number, name: string) => {
    Swal.fire({
      title: "Tem Certeza?",
      text: `Apagar "${name}" ?`,
      icon: "warning",
      iconColor: theme.palette.error.main,
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: "#aaa",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Deletar",
    }).then((result) => {
      if (result.isConfirmed) {
        GroupService.deleteById(id).then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            Swal.fire({
              title: "Deletado!",
              text: "Grupo apagado.",
              icon: "success",
            });
            listGroups();
            setGroupSelectedRow(0);
          }
        });
      }
    });
  };

  const handleGroupRowClick = async (id: number) => {
    setGroupSelectedRow(id);
    setSearchParams((old) => {
      old.delete("prodInGroupSearch");
      return old;
    });
  };

  const handleCleanClick = () => {
    setGroupSelectedRow(0);
  };

  const handleKeyDownNewGroup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter' || e.key === 'Enter') handleNewGroup();
  }

  // Prod Handles
  const handleProdRowClick = (id: number) => {
    setProdSelected(id);
    setErrorExists(false);
  };

  const handlePutProdInGroup = async () => {
    const response = await GroupService.putProdInGroup(
      groupSelectedRow,
      prodSelected
    );
    if (response instanceof Error) {
      setErrorExists(true);
    } else {
      Swal.fire({
        icon: "success",
        title: "Produto Adicionado !",
        showConfirmButton: false,
        timer: 1000,
      });
      listProdsInGroup();
    }
  };

  const handleRemoveProdFromGroup = async (prod_id: number) => {
    const response = await GroupService.removeProdFromGroup(
      groupSelectedRow,
      prod_id
    );
    if (response instanceof Error) {
      console.error("Ocorreu algum erro no momento da remoção do produto!");
    } else {
      Swal.fire({
        icon: "success",
        title: "Produto Removido !",
        showConfirmButton: false,
        timer: 1000,
      });
      listProdsInGroup();
    }
  };


  // CHECKBOX
  const [loading, setLoading] = useState(false);

  const handleCheckBox = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (e.target.checked) {
        await GroupService.updateShow(groupSelectedRow, true);
      } else {
        await GroupService.updateShow(groupSelectedRow, false);
      }
      listProdsInGroup();
      listGroups();
    } catch (e) {
      alert(e)
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutMain title="Grupos" subTitle="Crie e gerencie grupos de produtos">
      <Grid container>
        <Grid item xs={4}>
          <Paper
            sx={{ backgroundColor: "#fff", px: 3, py: 1, mr: 5, mb: 1 }}
            variant="elevation"
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <TextField
                size="small"
                placeholder={"Novo Grupo"}
                value={groupNameInput}
                onChange={(event) => setGroupNameInput(event.target.value)}
                autoComplete="off"
                onKeyDown={handleKeyDownNewGroup}
              />
              <Button variant="contained" onClick={handleNewGroup}>
                <AddIcon />
              </Button>
            </Box>
          </Paper>
          <Paper
            sx={{
              backgroundColor: "#fff",
              px: 3,
              py: 1,
              mr: 5,
              minHeight: 600,
            }}
            variant="elevation"
          >
            <TextField
              size="small"
              placeholder={"Pesquisar Grupo"}
              value={groupSearch}
              onChange={(event) =>
                setSearchParams((old) => {
                  old.set("groupSearch", event.target.value);
                  return old;
                })
              }
              autoComplete="off"
              fullWidth
            />
            <Box minHeight={470}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupRows.map((group) => (
                    <TableRow
                      key={group.id}
                      selected={groupSelectedRow == group.id}
                      hover
                      sx={{ cursor: "pointer", ...(group.show && { borderLeft: "4px solid #1C26" }) }}
                      onClick={() => handleGroupRowClick(group.id)}
                    >
                      <TableCell>{group.name}</TableCell>
                      <TableCell align="right">
                        <Fab
                          size="medium"
                          color="error"
                          aria-label="add"
                          onClick={() =>
                            handleDeleteGroup(group.id, group.name)
                          }
                        >
                          <Icon>delete</Icon>
                        </Fab>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {groupTotalCount === 0 && (
                  <caption>Nenhum grupo encontrado</caption>
                )}
              </Table>
            </Box>
            {groupTotalCount > 0 && groupTotalCount > GROUP_ROW_LIMIT && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={Number(groupPage)}
                    count={Math.ceil(groupTotalCount / GROUP_ROW_LIMIT)}
                    onChange={(_, newPage) =>
                      setSearchParams((old) => {
                        old.set("groupPage", newPage.toString());
                        return old;
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{ backgroundColor: "#fff", mr: 4, px: 3, py: 1, mb: 1 }}
            variant="elevation"
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                variant="outlined"
                onClick={handleCleanClick}
                disabled={!groupSelectedRow}
              >
                <UndoIcon fontSize="small" sx={{ mr: 1 }} />
                Limpar Seleção
              </Button>
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                disabled={!groupSelectedRow}
              >
                <AddIcon sx={{ mr: 1 }} />
                Adicionar Produto
              </Button>
            </Box>
          </Paper>
          <Paper
            sx={{
              backgroundColor: "#fff",
              mr: 4,
              px: 3,
              py: 1,
              minHeight: 600,
            }}
            variant="elevation"
          >
            {!NAProd && (
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} px={2}>
                <TextField
                  size="small"
                  placeholder={"Pesquisar Produto"}
                  value={prodInGroupSearch}
                  onChange={(event) =>
                    setSearchParams((old) => {
                      old.set("prodInGroupSearch", event.target.value);
                      return old;
                    })
                  }
                  autoComplete="off"
                  sx={{ minWidth: 600 }}
                />
                <FormControlLabel
                  value="start"
                  control={<Checkbox onChange={handleCheckBox} checked={checkBoxStatus} disabled={loading} />}
                  label="Mostrar grupo no caixa"
                  labelPlacement="start"
                  sx={{ mr: 2 }}
                />
              </Box>
            )}
            {NAProd && (
              <Alert icon={false} color="warning" sx={{ mt: 2 }}>
                Selecione um grupo
              </Alert>
            )}
            <Box minHeight={470}>
              {!NAProd && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Setor</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prodGroupRows.map((prod) => (
                      <TableRow key={prod.id} hover>
                        <TableCell>{prod.code}</TableCell>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell>
                          {prod.sector === 1
                            ? "1 - Bebidas"
                            : prod.sector === 2
                              ? "2 - Chocolates"
                              : prod.sector === 3
                                ? "3 - Salgadinhos"
                                : prod.sector === 4
                                  ? "4 - Sorvetes"
                                  : `${prod.sector} - Desconhecido`}
                        </TableCell>
                        <TableCell>R$ {prod.price}</TableCell>
                        <TableCell>
                          <Fab
                            size="medium"
                            color="error"
                            aria-label="add"
                            onClick={() => handleRemoveProdFromGroup(prod.id)}
                          >
                            <RemoveIcon />
                          </Fab>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {prodGroupTotalCount === 0 && (
                    <caption>Nenhum produto encontrado</caption>
                  )}
                </Table>
              )}
            </Box>
            {prodGroupTotalCount > 0 &&
              prodGroupTotalCount > PRODGROUP_ROW_LIMIT && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Pagination
                      page={Number(prodInGroupPage)}
                      count={Math.ceil(
                        prodGroupTotalCount / PRODGROUP_ROW_LIMIT
                      )}
                      onChange={(_, newPage) =>
                        setSearchParams((old) => {
                          old.set("prodInGroupPage", newPage.toString());
                          return old;
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
          </Paper>
        </Grid>
      </Grid>
      {/* ADD MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        sx={{
          "& .MuiDialog-paper": { backgroundColor: "#fff", maxWidth: 450 },
        }}
      >
        <DialogTitle>Adicionar Produtos:</DialogTitle>
        <DialogContent>
          <Box minHeight={470}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <TextField
                      size="small"
                      placeholder={"Pesquisar Produto"}
                      value={prodSearch}
                      onChange={(event) =>
                        setSearchParams((old) => {
                          old.set("prodSearch", event.target.value);
                          old.delete("prodPage");
                          return old;
                        })
                      }
                      autoComplete="off"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prodRows.map((prod) => (
                  <TableRow
                    key={prod.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleProdRowClick(prod.id)}
                    selected={prodSelected == prod.id}
                  >
                    <TableCell>{prod.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {prodTotalCount === 0 && (
                <caption>Nenhum produto encontrado</caption>
              )}
            </Table>
          </Box>
          {errorExists && (
            <Alert severity="warning">Produto ja pertence ao grupo</Alert>
          )}
          {prodTotalCount > 0 && prodTotalCount > PROD_ROW_LIMIT && (
            <Box display={"flex"} justifyContent={"center"}>
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={Number(prodPage)}
                    count={Math.ceil(prodTotalCount / PROD_ROW_LIMIT)}
                    onChange={(_, newPage) =>
                      setSearchParams((old) => {
                        old.set("prodPage", newPage.toString());
                        return old;
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            </Box>
          )}
          <Button
            fullWidth
            variant="contained"
            disabled={!prodSelected}
            onClick={handlePutProdInGroup}
          >
            Adicionar
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </LayoutMain >
  );
};
