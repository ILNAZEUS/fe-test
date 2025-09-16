import axios from "axios";
import { ScannerApiResponse } from "../types/test-task-types";
import { TokenData, mapScannerResultToTokenData } from "@entities/Token";

const API_BASE = "https://api-rs.dexcelerate.com";

export async function fetchScannerTokens(params: object): Promise<TokenData[]> {
  const response = await axios.get<ScannerApiResponse>(`${API_BASE}/scanner`, {
    params,
  });

  const tokens: TokenData[] = response.data.pairs.map(
    mapScannerResultToTokenData
  );
  return tokens;
}
