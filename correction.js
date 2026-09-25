<option value="">All Accounts</option>
<option value="1010">Cash</option>
<option value="1020">Bank</option>
<option value="1030">Accounts Receivable</option>
<option value="1040">Inventory</option>
<option value="1500">Machinery</option>
<option value="1590">Accumulated Depreciation</option>
<option value="2010">Accounts Payable</option>
<option value="2020">Loans Payable</option>
<option value="2030">Deferred Revenue</option>
<option value="3010">Owner's Capital</option>
<option value="4010">Sales Revenue</option>
<option value="5010">Feed Expense</option>
<option value="5020">Salary Expense</option>
<option value="5030">Rent Expense</option>
<option value="5040">Utilities Expense</option>
<option value="5050">Depreciation Expense</option>





<section class="app-section" id="dashboardSection">

    <h2>Financial Dashboard</h2>

    <div class="filter-controls">
        <label>
            From
            <input id="dashboardFromDate" type="date">
        </label>

        <label>
            To
            <input id="dashboardToDate" type="date">
        </label>

        <button id="refreshDashboard" type="button">
            Refresh Dashboard
        </button>
    </div>

    <!-- FINANCIAL POSITION -->
    <div class="dashboard-group">
        <h3>Financial Position</h3>

        <div class="dashboard-cards">

            <div class="dashboard-card">
                <span>Total Assets</span>
                <strong id="cardTotalAssets">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Total Liabilities</span>
                <strong id="cardTotalLiabilities">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Total Equity</span>
                <strong id="cardTotalEquity">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Cash & Bank</span>
                <strong id="cardCashBank">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Accounts Receivable</span>
                <strong id="cardReceivables">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Accounts Payable</span>
                <strong id="cardPayables">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Loans Payable</span>
                <strong id="cardLoans">0.00</strong>
            </div>

        </div>
    </div>


    <!-- WORKING CAPITAL -->
    <div class="dashboard-group">
        <h3>Working Capital</h3>

        <div class="dashboard-cards">

            <div class="dashboard-card">
                <span>Current Assets</span>
                <strong id="cardCurrentAssets">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Current Liabilities</span>
                <strong id="cardCurrentLiabilities">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Working Capital</span>
                <strong id="cardWorkingCapital">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Current Ratio</span>
                <strong id="cardCurrentRatio">0.00</strong>
            </div>

        </div>
    </div>


    <!-- PERFORMANCE -->
    <div class="dashboard-group">
        <h3>Performance</h3>

        <div class="dashboard-cards">

            <div class="dashboard-card">
                <span>Revenue</span>
                <strong id="cardRevenue">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Expenses</span>
                <strong id="cardExpenses">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Net Profit</span>
                <strong id="cardNetProfit">0.00</strong>
            </div>

            <div class="dashboard-card">
                <span>Profit Margin</span>
                <strong id="cardProfitMargin">0.00%</strong>
            </div>

        </div>
    </div>

</section>




@media(max-width:760px){
    body{
        padding-bottom:64px;
    }
    .app-sidebar{
        transform:translateX(-100%);
        transition:transform .22s ease;
        width:280px;
        box-shadow:10px 0 30px rgba(0,0,0,.18);
    }
    .app-sidebar.open{
        transform:translateX(0);
    }
    .sidebar-overlay{
        position:fixed;
        inset:0;background:rgba(0,0,0,.42);
        z-index:900;
    }
    .sidebar-overlay.show{
        display:block;
    }
    .app-main{
        margin-left:0;
        width:100%;
    }
    .app-topbar{
        height:64px;
        padding:0 14px;
    }
    .menu-toggle{
        display:block;
    }
    .page-heading h1{
        font-size:17px;
    }.app-badge{
        display:none;
    }.app-content{
        padding:12px;
    }
    .app-section{
        padding:16px;
        border-radius:11px;
    }
    .mobile-nav{
        position:fixed;
        display:flex;
        bottom:0;
        left:0;
        right:0;
        height:64px;
        background:#fff;
        border-top:1px solid var(--border);
        z-index:800;
        justify-content:space-around;
    }
    .mobile-nav button{
        flex:1;border:0;
        background:transparent;
        color:var(--muted);
        font-size:10px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:3px;
    }
    .mobile-nav button.active{
        color:var(--accent);
        font-weight:700;
    }
    .mobile-icon{
        width:6px;
        height:6px;
        border:1px solid currentColor;
        border-radius:50%;
    }
    .statement-controls,.filter-controls{
        align-items:stretch;
        flex-direction:column;
    }
    .statement-controls label,.filter-controls label{
        width:100%;
    }
    .statement-controls input,.statement-controls select,.filter-controls input,.filter-controls select{
        width:100%;
    }
    .app-section table{
        display:block;
        overflow-x:auto;
        white-space:nowrap;
    }
    .app-section form{
        display:block;
    }
    .app-section .form-group{
        margin-bottom:12px;
    }
}


@media(max-width:760px){

    body{
        padding-bottom:0;
    }

    /* Keep the full accounting sidebar available */
    .app-sidebar{
        transform:translateX(-100%);
        transition:transform .22s ease;
        width:280px;
        height:100vh;
        box-shadow:10px 0 30px rgba(0,0,0,.18);
    }

    /* Hamburger opens the sidebar */
    .app-sidebar.open{
        transform:translateX(0);
    }

    /* Make the complete menu scrollable */
    .sidebar-nav{
        overflow-y:auto;
        overflow-x:hidden;
        flex:1;
        min-height:0;
        -webkit-overflow-scrolling:touch;
    }

    .sidebar-overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.42);
        z-index:900;
    }

    .sidebar-overlay.show{
        display:block;
    }

    /* Main content uses full phone width */
    .app-main{
        margin-left:0;
        width:100%;
    }

    .app-topbar{
        height:64px;
        padding:0 14px;
    }

    .menu-toggle{
        display:block;
    }

    .page-heading h1{
        font-size:17px;
    }

    .app-badge{
        display:none;
    }

    .app-content{
        padding:12px;
    }

    .app-section{
        padding:16px;
        border-radius:11px;
    }

    /* Hide the four-item bottom navigation */
    .mobile-nav{
        display:none;
    }

    .statement-controls,
    .filter-controls{
        align-items:stretch;
        flex-direction:column;
    }

    .statement-controls label,
    .filter-controls label{
        width:100%;
    }

    .statement-controls input,
    .statement-controls select,
    .filter-controls input,
    .filter-controls select{
        width:100%;
    }

    .app-section table{
        display:block;
        overflow-x:auto;
        white-space:nowrap;
    }

    .app-section form{
        display:block;
    }

    .app-section .form-group{
        margin-bottom:12px;
    }
}







id: crypto.randomUUID()

=

import { generateId } from "./id.js";


id: generateId("txn")



=

generateId("txn")     // transaction
generateId("journal") // journal entry
generateId("audit")   // audit log
generateId("asset")   // asset
generateId("party")   // customer/supplier