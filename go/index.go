package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sort"
)

type Transaction struct {
	BlockHash        string `json:"blockHash"`
	BlockNumber      string `json:"blockNumber"`
	From             string `json:"from"`
	Gas              string `json:"gas"`
	GasPrice         string `json:"gasPrice"`
	Hash             string `json:"hash"`
	Input            string `json:"input"`
	Nonce            string `json:"nonce"`
	To               string `json:"to"`
	TransactionIndex string `json:"transactionIndex"`
	Value            string `json:"value"`
	V                string `json:"v"`
	R                string `json:"r"`
	S                string `json:"s"`
}

type Result struct {
	Difficulty       string        `json:"difficulty"`
	ExtraData        string        `json:"extraData"`
	GasLimit         string        `json:"gasLimit"`
	GasUsed          string        `json:"gasUsed"`
	Hash             string        `json:"hash"`
	LogsBloom        string        `json:"logsBloom"`
	Miner            string        `json:"miner"`
	MixHash          string        `json:"mixHash"`
	Nonce            string        `json:"nonce"`
	Number           string        `json:"number"`
	ParentHash       string        `json:"parentHash"`
	ReceiptsRoot     string        `json:"receiptsRoot"`
	Sha3Uncles       string        `json:"sha3Uncles"`
	Size             string        `json:"size"`
	StateRoot        string        `json:"stateRoot"`
	Timestamp        string        `json:"timestamp"`
	TotalDifficulty  string        `json:"totalDifficulty"`
	Transactions     []Transaction `json:"transactions"`
	TransactionsRoot string        `json:"transactionsRoot"`
	Uncles           []string      `json:"uncles"`
}

type ResultNotFound struct {
	Message string `json:"message"`
}

type NotFoundResponse struct {
	JsonRpc string         `json:"jsonrpc"`
	Id      string         `json:"id"`
	Result  ResultNotFound `json:"result"`
}

type BlockResponse struct {
	JsonRpc string `json:"jsonrpc"`
	Id      string `json:"id"`
	Result  Result `json:"result"`
}

type BlockListResponse struct {
	JsonRpc string  `json:"jsonrpc"`
	Result  []Block `json:"result"`
}

type Block struct {
	Id     string `json:"id"`
	Result Result `json:"result"`
}

func blockListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	jsonFile, _ := os.Open("blocks.json")
	byteValue, _ := ioutil.ReadAll(jsonFile)
	defer jsonFile.Close()
	var blocks []Block
	json.Unmarshal(byteValue, &blocks)
	var data []byte

	sort.SliceStable(blocks, func(i, j int) bool {
		return blocks[i].Id > blocks[j].Id
	})

	data, _ = json.Marshal(BlockListResponse{
		JsonRpc: "2.0",
		Result:  blocks,
	})
	w.Write(data)
}

func blockHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	id := r.URL.Path[len("/api/block/"):]

	jsonFile, _ := os.Open("blocks.json")
	byteValue, _ := ioutil.ReadAll(jsonFile)
	defer jsonFile.Close()

	var blocks []Block
	json.Unmarshal(byteValue, &blocks)

	var block Block

	if id == "latest" {
		block = blocks[len(blocks)-1]
	} else {
		for index := 0; index < len(blocks); index++ {
			tmpBlock := blocks[index]
			if string(tmpBlock.Id) == id {
				block = blocks[index]
			}
		}
	}

	var data []byte

	if block.Id != "" {
		data, _ = json.Marshal(BlockResponse{
			Id:      block.Id,
			JsonRpc: "2.0",
			Result:  block.Result,
		})
	} else {
		data, _ = json.Marshal(NotFoundResponse{
			Id:      "",
			JsonRpc: "2.0",
			Result: ResultNotFound{
				Message: "Not found block",
			},
		})
	}

	w.Write(data)
}

func frontHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi there, I love %s", r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/api/block/list", blockListHandler)
	http.HandleFunc("/api/block/", blockHandler)
	http.HandleFunc("/", frontHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
