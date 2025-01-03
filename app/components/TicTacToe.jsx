// import React, { useState, useEffect } from "react";
// import BoardConfig from "./BoardConfig";
// import "../styles/TicTacToe.css";
// import { useAuth } from "../lib/AuthContext";
// import { db } from "../lib/firebase";
// import { doc, updateDoc, increment } from "firebase/firestore";

// const TicTacToe = () => {
// 	const { currentUser } = useAuth();
// 	const [board, setBoard] = useState(
// 		Array(3)
// 			.fill(null)
// 			.map(() => Array(3).fill(null))
// 	);
// 	const [currentPlayer, setCurrentPlayer] = useState(null); // Zmieniamy to na null
// 	const [winner, setWinner] = useState(null);
// 	const [movesX, setMovesX] = useState(0); // liczba ruchów gracza X
// 	const [movesO, setMovesO] = useState(0); // liczba ruchów gracza O
// 	const [freeCells, setFreeCells] = useState(9); // liczba wolnych pól
// 	const [config, setConfig] = useState({
// 		backgroundColor: "#ffffff",
// 		symbolColor: "#000000",
// 		borderColor: "#000000",
// 		cellSize: 50,
// 		symbolSize: 24,
// 	});
// 	const [playerSymbol, setPlayerSymbol] = useState(null); // Nowy stan do przechowywania symbolu gracza

// 	useEffect(() => {
// 		const savedState = JSON.parse(
// 			localStorage.getItem("ticTacToeState")
// 		);
// 		if (savedState) {
// 			setBoard(savedState.board);
// 			setCurrentPlayer(savedState.currentPlayer);
// 			setWinner(savedState.winner);
// 			setMovesX(savedState.movesX);
// 			setMovesO(savedState.movesO);
// 			setFreeCells(savedState.freeCells);
// 		}
// 	}, []);

// 	useEffect(() => {
// 		localStorage.setItem(
// 			"ticTacToeState",
// 			JSON.stringify({
// 				board,
// 				currentPlayer,
// 				winner,
// 				movesX,
// 				movesO,
// 				freeCells,
// 			})
// 		);
// 	}, [board, currentPlayer, winner, movesX, movesO, freeCells]);

// 	const checkWinner = (board) => {
// 		const size = board.length;

// 		for (let i = 0; i < size; i++) {
// 			if (
// 				board[i].every(
// 					(cell) =>
// 						cell ===
// 						currentPlayer
// 				)
// 			)
// 				return true;
// 			if (
// 				board.every(
// 					(row) =>
// 						row[i] ===
// 						currentPlayer
// 				)
// 			)
// 				return true;
// 		}

// 		if (
// 			board.every(
// 				(row, index) =>
// 					row[index] === currentPlayer
// 			)
// 		)
// 			return true;
// 		if (
// 			board.every(
// 				(row, index) =>
// 					row[size - index - 1] ===
// 					currentPlayer
// 			)
// 		)
// 			return true;

// 		return false;
// 	};

// 	// Funkcja do losowania pustego pola
// 	const getRandomEmptyCell = (board) => {
// 		const emptyCells = [];
// 		for (let row = 0; row < 3; row++) {
// 			for (let col = 0; col < 3; col++) {
// 				if (!board[row][col]) {
// 					emptyCells.push([row, col]);
// 				}
// 			}
// 		}
// 		const randomIndex = Math.floor(
// 			Math.random() * emptyCells.length
// 		);
// 		return emptyCells[randomIndex];
// 	};

// 	const handleCellClick = (row, col) => {
// 		if (board[row][col] || winner) return;

// 		const newBoard = board.map((r, rowIndex) =>
// 			r.map((cell, colIndex) =>
// 				rowIndex === row && colIndex === col
// 					? currentPlayer
// 					: cell
// 			)
// 		);

// 		setFreeCells(freeCells - 1);

// 		if (currentPlayer === "X") {
// 			setMovesX(movesX + 1);
// 		} else {
// 			setMovesO(movesO + 1);
// 		}

// 		if (checkWinner(newBoard)) {
// 			setWinner(currentPlayer);
// 			updateUserStats(currentUser.uid, currentPlayer); // Zaktualizuj statystyki w Firebase
// 		} else if (newBoard.flat().every((cell) => cell)) {
// 			setWinner("Remis");
// 		} else {
// 			setCurrentPlayer(
// 				currentPlayer === "X" ? "O" : "X"
// 			);
// 		}

// 		setBoard(newBoard);
// 	};

// 	const computerMove = () => {
// 		const [row, col] = getRandomEmptyCell(board);
// 		handleCellClick(row, col);
// 	};

// 	const resetGame = () => {
// 		setBoard(
// 			Array(3)
// 				.fill(null)
// 				.map(() => Array(3).fill(null))
// 		);
// 		setCurrentPlayer(playerSymbol); // Zaczynamy od wybranego symbolu
// 		setWinner(null);
// 		setMovesX(0);
// 		setMovesO(0);
// 		setFreeCells(9);
// 	};

// 	const handleConfigChange = (e) => {
// 		const { name, value } = e.target;
// 		setConfig((prevConfig) => ({
// 			...prevConfig,
// 			[name]:
// 				name === "cellSize" ||
// 				name === "symbolSize"
// 					? parseInt(value)
// 					: value,
// 		}));
// 	};

// 	const updateUserStats = async (userId, winner) => {
// 		if (winner === "X" || winner === "O") {
// 			const userRef = doc(db, "users", userId);
// 			await updateDoc(userRef, {
// 				wins: increment(1),
// 			});
// 		}
// 	};

// 	const handleSymbolSelection = (symbol) => {
// 		setPlayerSymbol(symbol);
// 		setCurrentPlayer(symbol);
// 	};

// 	// Uruchamiamy ruch komputera, jeśli to jego kolej
// 	useEffect(() => {
// 		if (currentPlayer === "O" && !winner) {
// 			computerMove();
// 		}
// 	}, [currentPlayer, winner]);

// 	return (
// 		<div>
// 			{currentPlayer === null ? (
// 				<div>
// 					<button
// 						onClick={() =>
// 							handleSymbolSelection(
// 								"X"
// 							)
// 						}
// 					>
// 						Wybierz X
// 					</button>
// 					<button
// 						onClick={() =>
// 							handleSymbolSelection(
// 								"O"
// 							)
// 						}
// 					>
// 						Wybierz O
// 					</button>
// 				</div>
// 			) : (
// 				<div>
// 					<div className="tic-tac-toe">
// 						{board.map(
// 							(
// 								row,
// 								rowIndex
// 							) => (
// 								<div
// 									key={
// 										rowIndex
// 									}
// 									className="row"
// 								>
// 									{row.map(
// 										(
// 											cell,
// 											colIndex
// 										) => (
// 											<div
// 												key={
// 													colIndex
// 												}
// 												className="cell"
// 												onClick={() =>
// 													handleCellClick(
// 														rowIndex,
// 														colIndex
// 													)
// 												}
// 												style={{
// 													backgroundColor:
// 														config.backgroundColor,
// 													color: config.symbolColor,
// 													borderColor: config.borderColor,
// 													width: `${config.cellSize}px`,
// 													height: `${config.cellSize}px`,
// 													fontSize: `${config.symbolSize}px`,
// 												}}
// 											>
// 												{
// 													cell
// 												}
// 											</div>
// 										)
// 									)}
// 								</div>
// 							)
// 						)}
// 						<div className="status">
// 							{winner
// 								? winner ===
// 								  "Remis"
// 									? "Remis! Gra zakończona."
// 									: `Wygrywa: ${winner}`
// 								: `Następny gracz: ${currentPlayer}`}
// 						</div>
// 						<div className="game-info">
// 							<p>
// 								Ruchy
// 								gracza
// 								1
// 								(X):{" "}
// 								{
// 									movesX
// 								}
// 							</p>
// 							<p>
// 								Ruchy
// 								gracza
// 								2
// 								(O):{" "}
// 								{
// 									movesO
// 								}
// 							</p>
// 							<p>
// 								Wolne
// 								pola:{" "}
// 								{
// 									freeCells
// 								}
// 							</p>
// 						</div>
// 						<button
// 							className="reset-btn"
// 							onClick={
// 								resetGame
// 							}
// 						>
// 							Zresetuj
// 							grę
// 						</button>
// 					</div>

// 					<BoardConfig
// 						config={config}
// 						onConfigChange={
// 							handleConfigChange
// 						}
// 					/>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default TicTacToe;
