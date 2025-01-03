import React from "react";
import "../styles/BoardConfig.css";

const BoardConfig = ({ config, onConfigChange }) => {
	return (
		<div className="board-config">
			<h3>Konfiguracja planszy</h3>
			<label>
				Rozmiar planszy:
				<input
					type="number"
					name="boardSize"
					value={config.boardSize}
					onChange={onConfigChange}
					min="3"
					max="10"
					className="mt-2 p-2 block border border-gray-300 rounded-md shadow-sm"
				/>
			</label>
			<label>
				Kolor tła:
				<input
					type="color"
					name="backgroundColor"
					value={config.backgroundColor}
					onChange={onConfigChange}
				/>
			</label>
			<label>
				Kolor symboli:
				<input
					type="color"
					name="symbolColor"
					value={config.symbolColor}
					onChange={onConfigChange}
				/>
			</label>
			<label>
				Kolor obramowania:
				<input
					type="color"
					name="borderColor"
					value={config.borderColor}
					onChange={onConfigChange}
				/>
			</label>
			<label>
				Rozmiar pola (px):
				<input
					type="number"
					name="cellSize"
					value={config.cellSize}
					onChange={onConfigChange}
					min="30"
					max="100"
				/>
			</label>
			<label>
				Rozmiar symbolu (px):
				<input
					type="number"
					name="symbolSize"
					value={config.symbolSize}
					onChange={onConfigChange}
					min="10"
					max="50"
				/>
			</label>
		</div>
	);
};

export default BoardConfig;
