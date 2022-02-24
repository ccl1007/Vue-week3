import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'luku612150',
      products: [],
      // 判斷是新增還是編輯
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {
    //   2.展開modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'));

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },
    // 取得一次產品列表
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    // 新增編輯都可使用updateProduct()
    updateProduct() {
      // 如果是新增就用post編輯資料
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      // 如果不是新增就用put編輯資料
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      // 因在api裡資料格式為{data:{ } }
      // 用[http]帶變數
      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        // 再重新取得一次產品列表
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    // openModal(目前狀態, 產品)---帶入兩個參數
    openModal(isNew, item) {
      // 判斷openModal的狀態
      // 為new則建立新產品
      if (isNew === 'new') {
        // 重製tempProduct的結構
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
        // 為edit則編輯
      } else if (isNew === 'edit') {
        // 避免傳參考，應該要使用淺拷貝
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
        // 為delete則刪除
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
}).mount('#app');