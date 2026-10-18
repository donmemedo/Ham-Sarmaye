export type Lang = "fa" | "en";
export type Text = Record<Lang, string>;

const fa = {
  brand: "ایران‌فاندرز",
  nav: { home: "خانه", deals: "طرح‌ها", dashboard: "پیش‌خوان", login: "ورود", logout: "خروج", theme: "تغییر پوسته", lang: "English" },
  hero: {
    badge: "سکوی تأمین مالی جمعی و سرمایه‌گذاری خطرپذیر",
    title1: "روی آینده",
    title2: "سرمایه‌گذاری کنید.",
    sub: "از ۵۰۰ هزار تومان، شریک استارتاپ‌ها و کسب‌وکارهای ارزیابی‌شده ایرانی شوید. شفاف، آنلاین و با گزارش‌دهی دوره‌ای.",
    cta: "مشاهده طرح‌ها",
    cta2: "ثبت‌نام رایگان",
  },
  stats: { raised: "مبلغ تأمین‌شده", investors: "سرمایه‌گذار", deals: "طرح فعال", avgReturn: "میانگین بازده پیش‌بینی‌شده" },
  how: {
    title: "سه قدم تا اولین سرمایه‌گذاری",
    steps: [
      { t: "ثبت‌نام و احراز هویت", d: "با شماره موبایل و کد سجام، در کمتر از ۲ دقیقه حساب کاربری بسازید." },
      { t: "انتخاب طرح", d: "طرح‌ها را بر اساس صنعت، رتبه ریسک و بازده مقایسه و انتخاب کنید." },
      { t: "پایش و دریافت سود", d: "پیشرفت طرح‌ها را در پیش‌خوان دنبال کنید و سود را در کیف پول دریافت کنید." },
    ],
  },
  features: {
    title: "همه‌چیز برای یک تصمیم آگاهانه",
    sub: "ابزارهایی که پیش از این فقط در دسترس صندوق‌های بزرگ بود.",
    items: [
      { t: "رتبه‌بندی ریسک", d: "هر طرح توسط کمیته ریسک مستقل ارزیابی و رتبه‌بندی می‌شود." },
      { t: "اتصال به سجام", d: "احراز هویت یکپارچه و مطابق الزامات بازار سرمایه." },
      { t: "پیش‌خوان پرتفوی", d: "ارزش، بازده و ترکیب سرمایه‌گذاری‌ها را یک‌جا ببینید." },
      { t: "اتاق معامله حرفه‌ای", d: "مستندات تکمیلی و سرمایه‌گذاری مشترک برای سرمایه‌گذاران حرفه‌ای." },
      { t: "گزارش دوره‌ای", d: "گزارش‌های پس از جذب سرمایه، شفاف و زمان‌بندی‌شده." },
      { t: "آموزش ریسک", d: "پیش از هر سرمایه‌گذاری، ریسک‌ها را ساده و روشن بشناسید." },
    ],
  },
  featured: { title: "طرح‌های داغ این هفته", all: "همه طرح‌ها" },
  cta: { title: "آماده‌اید شریک رشد باشید؟", sub: "همین حالا حساب کاربری بسازید و اولین طرح را انتخاب کنید.", btn: "شروع کنید" },
  footer: {
    disclaimer: "سرمایه‌گذاری در طرح‌های تأمین مالی جمعی با ریسک همراه است و ممکن است بخشی یا تمام سرمایه از دست برود. اعداد این نسخه نمایشی هستند.",
    rights: "© ۱۴۰۵ ایران‌فاندرز کالب",
  },
  deals: { title: "طرح‌ها", sub: "فرصت‌های سرمایه‌گذاری ارزیابی‌شده را کشف کنید.", search: "جستجوی طرح یا شهر", all: "همه", anyRisk: "همه ریسک‌ها", empty: "طرحی با این فیلترها پیدا نشد." },
  industry: { fintech: "فین‌تک", health: "سلامت", agritech: "کشاورزی", energy: "انرژی", logistics: "لجستیک", ai: "هوش مصنوعی" } as Record<string, string>,
  risk: { A: "ریسک کم", B: "ریسک متوسط", C: "ریسک زیاد" } as Record<string, string>,
  deal: {
    raised: "تأمین‌شده", of: "از", investors: "سرمایه‌گذار", daysLeft: "روز مانده", ret: "بازده سالانه", months: "ماه",
    duration: "مدت طرح", overview: "درباره طرح", highlights: "نقاط قوت", risks: "ریسک‌ها", team: "تیم", funds: "مصرف منابع",
    back: "بازگشت به طرح‌ها", funded: "تکمیل شده",
  },
  invest: {
    title: "سرمایه‌گذاری", amount: "مبلغ سرمایه‌گذاری (تومان)", min: "حداقل مبلغ", estimate: "سود پیش‌بینی‌شده",
    total: "دریافتی پیش‌بینی‌شده", confirm: "تایید و سرمایه‌گذاری", login: "برای سرمایه‌گذاری وارد شوید",
    success: "سرمایه‌گذاری شما ثبت شد", view: "مشاهده در پیش‌خوان", note: "بازده تضمین‌شده نیست.",
  },
  auth: {
    title: "ورود یا ثبت‌نام", sub: "شماره موبایل خود را بنویسید تا کد تایید برایتان پیامک شود.",
    phone: "شماره موبایل", send: "دریافت کد تایید", code: "کد تایید", codeSub: "کد ۴ رقمی پیامک‌شده به", verify: "تایید و ورود",
    edit: "تغییر شماره", demo: "نسخه نمایشی — کد تایید:", terms: "با ورود، شرایط استفاده و حریم خصوصی را می‌پذیرید.",
  },
  dash: {
    title: "پیش‌خوان", hello: "خوش آمدید", total: "کل سرمایه‌گذاری", expected: "سود پیش‌بینی‌شده", count: "تعداد طرح‌ها",
    holdings: "دارایی‌ها", allocation: "ترکیب پرتفوی", txs: "تراکنش‌ها", empty: "هنوز سرمایه‌گذاری نکرده‌اید.", explore: "مشاهده طرح‌ها",
  },
  err: {
    empty: "اینجا را خالی نگذارید", invalid_phone: "شماره موبایل نادرست است", wrong_code: "کد تایید نادرست است",
    min_amount: "مبلغ کمتر از حداقل مجاز است", over_capacity: "این مبلغ از ظرفیت باقی‌مانده طرح بیشتر است",
    unauthorized: "لطفاً دوباره وارد شوید", error: "مشکلی پیش آمد، دوباره تلاش کنید",
  } as Record<string, string>,
  unit: "تومان",
};

const en: typeof fa = {
  brand: "IranFunders",
  nav: { home: "Home", deals: "Deals", dashboard: "Dashboard", login: "Log in", logout: "Log out", theme: "Toggle theme", lang: "فارسی" },
  hero: {
    badge: "Crowdfunding & venture investing platform",
    title1: "Invest in",
    title2: "what's next.",
    sub: "From 500k Toman, become a partner in vetted Iranian startups and SMEs. Transparent, online, with periodic reporting.",
    cta: "Explore deals",
    cta2: "Sign up free",
  },
  stats: { raised: "Raised", investors: "Investors", deals: "Live deals", avgReturn: "Avg. projected return" },
  how: {
    title: "Three steps to your first investment",
    steps: [
      { t: "Sign up & verify", d: "Create an account with your phone and Sejam code in under 2 minutes." },
      { t: "Pick a deal", d: "Compare deals by industry, risk rating and projected return." },
      { t: "Track & earn", d: "Follow progress in your dashboard and receive returns in your wallet." },
    ],
  },
  features: {
    title: "Everything for an informed decision",
    sub: "Tools that used to be reserved for big funds.",
    items: [
      { t: "Risk rating", d: "Every deal is assessed and rated by an independent risk committee." },
      { t: "Sejam integration", d: "One-step identity verification that meets capital-market rules." },
      { t: "Portfolio dashboard", d: "See value, returns and allocation in one place." },
      { t: "Pro deal room", d: "Extra documents and co-investment for professional investors." },
      { t: "Periodic reports", d: "Clear, scheduled post-funding reports." },
      { t: "Risk education", d: "Understand the risks plainly before every investment." },
    ],
  },
  featured: { title: "Trending this week", all: "All deals" },
  cta: { title: "Ready to back what's next?", sub: "Create an account now and pick your first deal.", btn: "Get started" },
  footer: {
    disclaimer: "Crowdfunding investments carry risk; you may lose part or all of your capital. Figures in this build are for demo purposes.",
    rights: "© 2026 Iran Funders Club",
  },
  deals: { title: "Deals", sub: "Discover vetted investment opportunities.", search: "Search deal or city", all: "All", anyRisk: "Any risk", empty: "No deals match these filters." },
  industry: { fintech: "Fintech", health: "Health", agritech: "Agritech", energy: "Energy", logistics: "Logistics", ai: "AI" },
  risk: { A: "Low risk", B: "Medium risk", C: "High risk" },
  deal: {
    raised: "raised", of: "of", investors: "investors", daysLeft: "days left", ret: "annual return", months: "months",
    duration: "Term", overview: "About", highlights: "Highlights", risks: "Risks", team: "Team", funds: "Use of funds",
    back: "Back to deals", funded: "Funded",
  },
  invest: {
    title: "Invest", amount: "Amount (Toman)", min: "Minimum", estimate: "Projected profit",
    total: "Projected payout", confirm: "Confirm & invest", login: "Log in to invest",
    success: "Your investment is confirmed", view: "View in dashboard", note: "Returns are not guaranteed.",
  },
  auth: {
    title: "Log in or sign up", sub: "Enter your mobile number and we'll text you a verification code.",
    phone: "Mobile number", send: "Get code", code: "Verification code", codeSub: "4-digit code sent to", verify: "Verify & log in",
    edit: "Change number", demo: "Demo build — your code:", terms: "By continuing you agree to the Terms and Privacy policy.",
  },
  dash: {
    title: "Dashboard", hello: "Welcome back", total: "Total invested", expected: "Projected profit", count: "Deals",
    holdings: "Holdings", allocation: "Allocation", txs: "Transactions", empty: "You haven't invested yet.", explore: "Explore deals",
  },
  err: {
    empty: "This field can't be empty", invalid_phone: "Mobile number is not valid", wrong_code: "Verification code is incorrect",
    min_amount: "Amount is below the minimum", over_capacity: "Amount exceeds the deal's remaining capacity",
    unauthorized: "Please log in again", error: "Something went wrong, try again",
  },
  unit: "Toman",
};

export const dict = { fa, en };
export type Dict = typeof fa;

const loc = (l: Lang) => (l === "fa" ? "fa-IR" : "en-US");
export const num = (n: number, l: Lang) => new Intl.NumberFormat(loc(l)).format(n);
export const compact = (n: number, l: Lang) => new Intl.NumberFormat(loc(l), { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const toman = (n: number, l: Lang) => `${compact(n, l)} ${dict[l].unit}`;
export const date = (s: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { dateStyle: "medium", timeStyle: "short" }).format(new Date(s));
// Persian/Arabic-Indic digits → ASCII, so "۰۹۱۲..." typed on a Persian keyboard still works
export const ascii = (s: string) => s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x6f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));
export const pct = (n: number, l: Lang) => `${num(n, l)}${l === "fa" ? "٪" : "%"}`;
