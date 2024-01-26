import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { VForm } from "../../shared/forms/VForm";
import { VTextField } from "../../shared/forms/VTextField";
import React, { useEffect, useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded';
import Swal from "sweetalert2";
import { FincashService, IFincash } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";

export const CloseFincash: React.FC = () => {
	const formRef = useRef<FormHandles>(null);

	const navigate = useNavigate();

	const [fincash, setFincash] = useState<IFincash>();
	const [totalValue, setTotalValue] = useState('0.00');
	const [denominationValues, setDenominationValues] = useState(
		{
			'0.05': 0,
			'0.10': 0,
			'0.25': 0,
			'0.50': 0,
			'1.00': 0,
			'2.00': 0,
			'5.00': 0,
			'10.00': 0,
			'20.00': 0,
			'50.00': 0,
			'100.00': 0,
			'200.00': 0,
		}
	);

	useEffect(() => {
		const fetchData = async () => {
			const fincashFetch = await FincashService.getOpenFincash();
			if (fincashFetch instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "Nenhum caixa aberto encontrado!",
					showConfirmButton: true,
				});
				navigate('/caixa/novo');
			} else {
				setFincash(fincashFetch)
			}
		}
		fetchData();
	},[navigate]);

	const calculateTotalValue = (updatedValues: Record<string, number>) => {
		let total = 0;
		for (const [denomination, quantity] of Object.entries(updatedValues)) {
			total += parseFloat(denomination) * quantity;
		}
		return total.toFixed(2); // Fixed to 2 decimal places for currency
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, denomination: string) => {
		const inputValue = parseInt(e.target.value, 10) || 0;
		setDenominationValues(prevValues => {
			const updatedValues = {
				...prevValues,
				[denomination]: inputValue,
			};
			const totalValue = calculateTotalValue(updatedValues);
			setTotalValue(totalValue);
			return updatedValues;
		});
	}

	const handleSubmit = async () => {
		const updatedTotalValue = calculateTotalValue(denominationValues);

		Swal.fire({
			title: 'Fechar Caixa',
			text: `Tem certeza que deseja fechar o caixa com "R$ ${updatedTotalValue}" ?`,
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#aaa',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Fechar'
		}).then((result) => {
			if (result.isConfirmed) {
				if (fincash) {
					FincashService.finish(fincash.id, Number(updatedTotalValue)).then((result) => {
						if (result instanceof Error) {
							alert(result.message);
						} else {
							Swal.fire({
								title: 'Finalizado!',
								text: 'Caixa Finalizado com sucesso !',
								icon: 'success',
							});
							navigate('/caixa/novo');
						}
					});
				}
			}
		});
	}

	return (
		<LayoutMain title="Fechamentos" subTitle="Feche o caixa">
			<Paper sx={{ backgroundColor: '#fff', mr: 4, px: 3, py: 1 }} variant="elevation">

				<VForm onSubmit={handleSubmit} placeholder={''} ref={formRef}>
					<Grid container sx={{ m: 3 }}>
						<Grid item xs={3}>
							<Box display={'flex'} flexDirection={'column'} gap={1}>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 0.05</Typography>
									<VTextField onChange={(e) => handleChange(e, '0.05')} name="0.05" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 0.10</Typography>
									<VTextField onChange={(e) => handleChange(e, '0.10')} name="0.10" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 0.25</Typography>
									<VTextField onChange={(e) => handleChange(e, '0.25')} name="0.25" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 0.50</Typography>
									<VTextField onChange={(e) => handleChange(e, '0.50')} name="0.50" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 1.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '1.00')} name="1.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 2.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '2.00')} name="2.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box display={'flex'} flexDirection={'column'} gap={1}>

								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 5.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '5.00')} name="5.00" sx={{ maxWidth: 100, ml: 2 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 10.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '10.00')} name="10.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 20.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '20.00')} name="20.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 50.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '50.00')} name="50.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 100.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '100.00')} name="100.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
								<Box display={'flex'} gap={1} alignItems={'center'}>
									<Typography>R$ 200.00</Typography>
									<VTextField onChange={(e) => handleChange(e, '200.00')} name="200.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" />
								</Box>
							</Box>
						</Grid>
					</Grid>
					<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={10} m={2} ml={8} mt={4} maxWidth={'31%'}>
						<Typography variant="h5">Total: R$ {totalValue}</Typography>
						<Button
							variant="contained"
							onClick={() => formRef.current?.submitForm()}
							sx={{ minHeight: 45, minWidth: 110 }}
						>
							<SportsScoreRoundedIcon sx={{ mr: 1 }} />
							Fechar Caixa
						</Button>
					</Box>
				</VForm>
			</Paper>
		</LayoutMain >
	);
};