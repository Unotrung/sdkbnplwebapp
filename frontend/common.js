// Done +++
function showHeader() {
    var html = `<div class='header-voolo'>
                    <div id='header-voolo-logo'>
                        <img src='./assets/img/VOOLO_logo_horizontal.png' />
                    </div>
                    <h1 id='header-voolo-title'>Chào mừng bạn đến với quy trình đăng ký Mua trước Trả sau</h1>
                </div>`;
    return html;
}

// Done +++
function pageTitle(element, str = '', cls = '') {
    if (str !== '') {
        $(element).prepend(str);
        $(element).addClass("non-flex");
        if (cls != '') $(element).addClass(cls);
    }
}

// Done +++
function showMessage(element, message, icon) {
    var html = `<div class='box showMessage'>
                    <div class='paragraph-text text-center margin-bottom-default'>
                        <div class='${icon}'></div>
                        ${message}
                        <p style='text-align: center;'>
                        Bấm vào <a class="ahref" href="${DOMAIN}" style='width:auto'>đây</a> để quay trở lại. Tự động trở lại trang mua hàng sau 5s.
                        </p>
                    </div> 
                </div> `;
    $(element).html(html);
}

// Done +++
/* Pin code ui */
var PincodeInput = function () {
    "use strict";
    return function () {
        function e(e, t) {
            var s = t.count,
                i = void 0 === s ? 4 : s,
                o = t.secure,
                l = void 0 !== o && o,
                n = t.previewDuration,
                u = void 0 === n ? 200 : n,
                c = t.numeric,
                r = void 0 === c || c,
                a = t.uppercase,
                h = void 0 === a || a,
                ipid = t.inputId;
            this.args = t, this.selector = document.querySelector(e), this.count = i, this.secure = l, this.previewDuration = u, this.numeric = r, this.uppercase = h, this.cells = [], this.focusedCellIdx = 0, this.value = "", this.ipid = ipid, this.setCells()
        }
        return e.prototype.setCells = function () {
            for (var e = 0; e < this.count; e++) {
                var t = document.createElement("input");
                var stt = e + 1;
                t.setAttribute("id", this.ipid + stt);
                t.classList.add("pincode-input"), this.numeric && t.setAttribute("inputmode", "numeric"), this.uppercase || (t.style.textTransform = "lowercase"), this.cells.push(t), this.selector.appendChild(t)
            }
            this.initCells()
        }, e.prototype.initCells = function () {
            var e = this;
            this.cells.forEach((function (t, s) {
                t.addEventListener("input", (function (t) {
                    var i = t.currentTarget.value;
                    e.onCellChanged(s, i)
                })), t.addEventListener("focus", (function () {
                    e.focusedCellIdx = s
                })), t.addEventListener("keydown", (function (t) {
                    e.onKeyDown(t, s), "ArrowLeft" !== t.key && "ArrowRight" !== t.key && "ArrowUp" !== t.key && "ArrowDown" !== t.key && "Backspace" !== t.key && "Delete" !== t.key && "Control" !== t.key && "Meta" !== t.key && e.cells[s].setAttribute("type", "text")
                })), t.addEventListener("focus", (function () {
                    t.classList.add("pincode-input--focused");
                    t.classList.remove("error_pincode_red");
                })), t.addEventListener("blur", (function () {
                    t.classList.remove("pincode-input--focused")
                }))
            }))
        }, e.prototype.onCellChanged = function (e, t) {
            var s = this;
            if (!this.isTheCellValid(t)) return this.cells[e].classList.remove("pincode-input--filled"), this.cells[e].value = "", void this.getValue();
            this.cells[e].classList.add("pincode-input--filled"), this.secure && this.previewDuration && setTimeout((function () {
                s.cells[e].setAttribute("type", "password")
            }), this.previewDuration), this.getValue(), this.focusNextCell()
        }, e.prototype.onKeyDown = function (e, t) {
            switch (e.key) {
                case "ArrowLeft":
                    this.focusPreviousCell();
                    break;
                case "ArrowRight":
                    this.focusNextCell();
                    break;
                case "Backspace":
                    this.cells[t].value.length || this.onCellErase(t, e)
            }
        }, e.prototype.onCellErase = function (e, t) {
            this.cells[e].value.length || (this.focusPreviousCell(), t.preventDefault())
        }, e.prototype.focusPreviousCell = function () {
            this.focusedCellIdx && this.focusCellByIndex(this.focusedCellIdx - 1)
        }, e.prototype.focusNextCell = function () {
            this.focusedCellIdx !== this.cells.length - 1 && this.focusCellByIndex(this.focusedCellIdx + 1)
        }, e.prototype.focusCellByIndex = function (e) {
            void 0 === e && (e = 0);
            var t = this.cells[e];
            t.focus(), t.select(), this.focusedCellIdx = e
        }, e.prototype.isTheCellValid = function (e) {
            return this.numeric ? !!e.match("^\\d{1}$") : e.length <= 1
        }, e.prototype.getValue = function () {
            var e = this;
            this.value = "", this.cells.forEach((function (t) {
                e.value += e.uppercase ? t.value.toUpperCase() : t.value
            })), this.args.onInput && this.args.onInput(this.value)
        }, e
    }()
}();

