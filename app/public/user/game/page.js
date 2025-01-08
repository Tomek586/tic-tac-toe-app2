"use client";
import React, { useState, useEffect } from "react";
import BoardConfig from "@/app/components/BoardConfig";
import "@/app/styles/TicTacToe.css";
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import Footer from "@/app/components/Footer";

const TicTacToe = () => {
	const { user } = useAuth();
	const [boardSize, setBoardSize] = useState(3);
	const [board, setBoard] = useState(
		Array(boardSize)
			.fill(null)
			.map(() => Array(boardSize).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState(null);
	const [winner, setWinner] = useState(null);
	const [movesX, setMovesX] = useState(0);
	const [movesO, setMovesO] = useState(0);
	const [freeCells, setFreeCells] = useState(boardSize * boardSize);
	const [playerSymbol, setPlayerSymbol] = useState(null);
	const [config, setConfig] = useState({
		backgroundColor: "#ffffff",
		symbolColor: "#000000",
		borderColor: "#000000",
		cellSize: 50,
		symbolSize: 24,
		boardSize: 3,
	});

	useEffect(() => {
		if (config.boardSize !== boardSize) {
			setBoardSize(config.boardSize);
			setBoard(
				Array(config.boardSize)
					.fill(null)
					.map(() =>
						Array(
							config.boardSize
						).fill(null)
					)
			);
			setFreeCells(config.boardSize * config.boardSize);
			setWinner(null);
			setMovesX(0);
			setMovesO(0);
		}
	}, [config.boardSize]);

	useEffect(() => {
		const savedState = JSON.parse(
			localStorage.getItem("ticTacToeState")
		);
		if (savedState) {
			setBoard(savedState.board);
			setCurrentPlayer(savedState.currentPlayer);
			setWinner(savedState.winner);
			setMovesX(savedState.movesX);
			setMovesO(savedState.movesO);
			setFreeCells(savedState.freeCells);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"ticTacToeState",
			JSON.stringify({
				board,
				currentPlayer,
				winner,
				movesX,
				movesO,
				freeCells,
			})
		);
	}, [board, currentPlayer, winner, movesX, movesO, freeCells]);

	const checkWinner = (board) => {
		const size = board.length;

		for (let i = 0; i < size; i++) {
			if (
				board[i].every(
					(cell) =>
						cell ===
						currentPlayer
				)
			)
				return true;
			if (
				board.every(
					(row) =>
						row[i] ===
						currentPlayer
				)
			)
				return true;
		}

		if (
			board.every(
				(row, index) =>
					row[index] === currentPlayer
			)
		)
			return true;
		if (
			board.every(
				(row, index) =>
					row[size - index - 1] ===
					currentPlayer
			)
		)
			return true;

		return false;
	};

	const getRandomEmptyCell = (currentBoard) => {
		const emptyCells = [];
		const size = currentBoard.length;

		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (!currentBoard[row][col]) {
					emptyCells.push([row, col]);
				}
			}
		}

		if (emptyCells.length === 0) return null;

		const randomIndex = Math.floor(
			Math.random() * emptyCells.length
		);
		return emptyCells[randomIndex];
	};

	const handleCellClick = (row, col) => {
		if (board[row][col] || winner) return;

		const newBoard = board.map((r, rowIndex) =>
			r.map((cell, colIndex) =>
				rowIndex === row && colIndex === col
					? currentPlayer
					: cell
			)
		);

		setFreeCells(freeCells - 1);

		if (currentPlayer === "X") {
			setMovesX(movesX + 1);
		} else {
			setMovesO(movesO + 1);
		}

		if (checkWinner(newBoard)) {
			setWinner(currentPlayer);
			if (user) {
				updateUserStats(
					user.uid,
					currentPlayer
				);
			}
		} else if (newBoard.flat().every((cell) => cell)) {
			setWinner("Remis");
			if (user) {
				updateUserStats(user.uid, "Remis");
			}
		} else {
			setCurrentPlayer(
				currentPlayer === "X" ? "O" : "X"
			);
		}

		setBoard(newBoard);
	};

	const computerMove = () => {
		const [row, col] = getRandomEmptyCell(board);
		handleCellClick(row, col);
	};

	const resetGame = () => {
		setBoard(
			Array(boardSize)
				.fill(null)
				.map(() => Array(boardSize).fill(null))
		);
		setCurrentPlayer(playerSymbol);
		setWinner(null);
		setMovesX(0);
		setMovesO(0);
		setFreeCells(boardSize * boardSize);
	};

	const handleConfigChange = (e) => {
		const { name, value } = e.target;
		const newValue =
			name === "boardSize" ||
			name === "cellSize" ||
			name === "symbolSize"
				? parseInt(value)
				: value;

		if (
			name === "boardSize" &&
			(newValue < 3 || newValue > 10)
		) {
			return;
		}

		setConfig((prevConfig) => ({
			...prevConfig,
			[name]: newValue,
		}));
	};

	const updateUserStats = async (uid, winner) => {
		if (!user) return;

		try {
			const userRef = doc(db, "users", uid);
			const userDoc = await getDoc(userRef);
			const userData = userDoc.data();

			if (userData && userData.games) {
				if (winner === "Remis") {
					// Jeśli remis, zwiększamy tylko liczbę remisów
					await updateDoc(userRef, {
						"games.Draws":
							increment(
								1
							),
						"games.TotalGames":
							increment(
								1
							),
					});
				} else if (winner === "X") {
					// Jeśli X wygrał, gracz wygrywa (ponieważ zawsze jest X)
					await updateDoc(userRef, {
						"games.Wins": increment(
							1
						),
						"games.TotalGames":
							increment(
								1
							),
					});
				} else if (winner === "O") {
					// Jeśli O wygrał, komputer wygrywa, gracz przegrywa
					await updateDoc(userRef, {
						"games.Losses":
							increment(
								1
							),
						"games.TotalGames":
							increment(
								1
							),
					});
				}
			} else {
				// Jeśli nie ma jeszcze danych użytkownika, tworzymy nowy rekord
				await setDoc(
					userRef,
					{
						games: {
							Wins:
								winner ===
								"X"
									? 1
									: 0,
							Losses:
								winner ===
								"O"
									? 1
									: 0,
							Draws:
								winner ===
								"Remis"
									? 1
									: 0,
							TotalGames: 1,
						},
					},
					{ merge: true }
				);
			}
		} catch (error) {
			console.error(
				"Błąd podczas aktualizacji statystyk:",
				error
			);
		}
	};

	const handleSymbolSelection = (symbol) => {
		setPlayerSymbol(symbol);
		setCurrentPlayer(symbol);
	};

	useEffect(() => {
		if (currentPlayer === "O" && !winner) {
			computerMove();
		}
	}, [currentPlayer, winner]);

	useEffect(() => {
		console.log("Status użytkownika:", user);
	}, [user]);

	return (
		<div>
			{currentPlayer === null ? (
				<div className="flex flex-col items-center space-y-4">
					<p>
						<button
							onClick={() =>
								handleSymbolSelection(
									"X"
								)
							}
							className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							Zaczyna X
							- Ja
						</button>
					</p>
					<button
						onClick={() =>
							handleSymbolSelection(
								"O"
							)
						}
						className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
					>
						Zaczyna O - Komputer
					</button>
				</div>
			) : (
				<div>
					<div className="tic-tac-toe">
						{board.map(
							(
								row,
								rowIndex
							) => (
								<div
									key={
										rowIndex
									}
									className="row"
								>
									{row.map(
										(
											cell,
											colIndex
										) => (
											<div
												key={
													colIndex
												}
												className="cell"
												onClick={() =>
													handleCellClick(
														rowIndex,
														colIndex
													)
												}
												style={{
													backgroundColor:
														config.backgroundColor,
													color: config.symbolColor,
													borderColor: config.borderColor,
													width: `${config.cellSize}px`,
													height: `${config.cellSize}px`,
													fontSize: `${config.symbolSize}px`,
												}}
											>
												{
													cell
												}
											</div>
										)
									)}
								</div>
							)
						)}
						<div className="status">
							{winner
								? winner ===
								  "Remis"
									? "Remis! Gra zakończona."
									: `Wygrywa: ${winner}`
								: `Następny gracz: ${currentPlayer}`}
						</div>
						<div className="game-info">
							<p>
								Ruchy
								gracza
								1
								(X):{" "}
								{
									movesX
								}
							</p>
							<p>
								Ruchy
								gracza
								2
								(O):{" "}
								{
									movesO
								}
							</p>
							<p>
								Wolne
								pola:{" "}
								{
									freeCells
								}
							</p>
						</div>
						<button
							className="reset-btn"
							onClick={
								resetGame
							}
						>
							Zresetuj
							grę
						</button>
					</div>

					<BoardConfig
						config={config}
						onConfigChange={
							handleConfigChange
						}
					/>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default TicTacToe;
