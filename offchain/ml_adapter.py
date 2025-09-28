"""ml_adapter.py
Simple off-chain ML adapter stub that 'recommends' a strategy.
It writes a JSON proposal file that can be used by a relayer script to call the on-chain DAO.
In a real setup, this would:
 - fetch on-chain and market data
 - run a model (RandomForest/LSTM/RL)
 - create a signed proposal or call a relayer service
"""
import json
from datetime import datetime

PROPOSAL_PATH = 'out/proposal.json'

def generate_proposal(strategy_address: str, description: str, amount_wei: int):
    payload = {
        'strategy': strategy_address,
        'description': description,
        'amount': str(amount_wei),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }
    import os
    os.makedirs('out', exist_ok=True)
    with open(PROPOSAL_PATH, 'w') as f:
        json.dump(payload, f, indent=2)
    print('Wrote proposal to', PROPOSAL_PATH)

if __name__ == '__main__':
    # demo values (replace with real model output)
    generate_proposal('0x0000000000000000000000000000000000000000', 'Allocate to strategy mock (demo)', 10**18)
