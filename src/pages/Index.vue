<template>
  <el-container v-loading="loading.page" class="container" ref="main">
    <el-header>
      <pager-header>
        <!--搜索框与排序菜单-->
        <search-input :name="activeRule?activeRule.name:null"
                      class="pager-header-input"
                      @search="handleClickSearch"
                      :keyword="page.current.keyword"></search-input>
      </pager-header>
    </el-header>
    <el-container>
      <el-aside ref="indexAside" width="200px" class="scroll-container">
        <el-scrollbar>
          <aside-menu :active="page.current.id"
                      :ruleList="rule"
                      @change="handleRuleChanged"></aside-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="index-main scroll-container" v-if="activeRule">
        <el-scrollbar class="index-main-scrollbar">
          <guide-page ref="guidePage" v-show="showGuidePage"
                      :count="rule.length"></guide-page>
          <div class="pager-search-header" ref="pagerSearchHeader">
            <div class="search-option">
              <!--排序选项-->
              <search-sort
                class="search-option-left"
                :url="page.current.url||activeRule.url"
                :paths="activeRule.paths"
                @change="handleSortChanged"
                :sortKey="page.current.sort"></search-sort>
              <!--页码-->
              <search-pagination :page="page.current.page"
                                 v-show="page.items"
                                 @change="handlePageChanged"></search-pagination>
            </div>
          </div>
          <!--搜索结果-->
          <div ref="pagerSearchItems" class="pager-search-items" v-loading="loading.table">
            <div class="index-main-content" v-if="page.items">
              <pager-items :items="page.items"
                           :keyword="page.current.keyword"
                           :baseURL="activeRule.url"
                           @show-detail="handleShowDetailDialog"></pager-items>
              <search-pagination class="footer-search-pagination"
                                 :page="page.current.page"
                                 @change="handlePageChanged"></search-pagination>
            </div>
          </div>
        </el-scrollbar>
        <el-backtop target=".index-main-scrollbar .el-scrollbar__wrap" ref="backtop">
        </el-backtop>
        <detail-dialog v-if="detailDialog"
                       :dialog="detailDialog"></detail-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import BrowserLink from '../components/BrowserLink'
  import SearchInput from '../components/SearchInput'
  import SearchSort from '../components/SearchSort'
  import SearchPagination from '../components/SearchPagination'
  import PagerItems from '../components/PagerItems'
  import GuidePage from '../components/GuidePage'
  import PagerHeader from '../components/PagerHeader'
  import DetailDialog from '../components/DetailDialog'
  import axios from '@/plugins/axios'
  import rule from '@/rule'

  export default {
    components: {
      DetailDialog,
      AsideMenu,
      BrowserLink,
      SearchSort,
      SearchInput,
      SearchPagination,
      PagerItems,
      GuidePage,
      PagerHeader
    },
    data () {
      return {
        rule: rule,
        page: {
          current: null,
          items: null
        },
        activeRule: null,
        loading: {
          table: false,
          page: false
        },
        showGuidePage: true,
        detailDialog: {
          show: false
        }
      }
    },
    methods: {
      handleRuleChanged (id) {
        this.handleActiveRule(id)
        this.page.current.page = 1

        this.handleRequestSearch()
      },
      handleActiveRule (id) {
        const activeRule = this.getRuleByID(id) || this.rule[0]

        // 如果当前规则没有此排序 就默认选择一个排序
        let keys = Object.keys(activeRule.paths)
        if (keys.indexOf(this.page.current.sort) === -1) {
          this.page.current.sort = keys[0]
        }
        this.activeRule = activeRule
        this.page.current.id = activeRule.id
        this.page.current.url = activeRule.url
      },
      handleClickSearch (keyword) {
        this.page.current.keyword = keyword
        this.page.current.page = 1
        this.handleRequestSearch()
      },
      handlePageChanged (page) {
        this.page.current.page = page
        this.handleRequestSearch()
      },
      /**
       * 更换排序
       */
      handleSortChanged (sortKey) {
        this.page.current.sort = sortKey
        this.page.current.page = 1
        this.handleRequestSearch()
      },
      updateAddress () {
        const params = this.page.current
        const path = `?id=${params.id}&k=${params.keyword}&s=${params.sort}&p=${params.page}`
        history.pushState(0, document.title, path)
        this.$localSetting.saveValue('last_rule_id', params.id)
      },
      /**
       * 请求搜索
       */
      handleRequestSearch () {
        const params = this.page.current
        if (params.keyword) {
          this.updateAddress()

          this.showGuidePage = false
          this.loading.table = true
          console.info('搜索', JSON.stringify(params, '/t', 2))

          axios.get('/search', {
            params: params
          }).then((rsp) => {
            this.page = rsp.data
          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          }).finally(() => {
            this.loading.table = false
          })
        }
      },
      getRuleByID (id) {
        for (let i = 0; i < this.rule.length; i++) {
          if (this.rule[i].id === id) {
            return this.rule[i]
          }
        }
      },
      handleShowDetailDialog ({name, path}) {
        this.detailDialog = {
          show: true,
          id: this.page.current.id,
          name: name,
          path: path
        }
      }
    },
    created () {
      this.page.current = this.$route.query
    },
    mounted () {
      const id = this.page.current.id || this.$localSetting.get('last_rule_id')
      this.handleActiveRule(id)
      this.handleRequestSearch()
    },
    head () {
      return this.page.current.keyword ? {
        title: `${this.page.current.keyword} - ${this.page.current.page} - ${this.$app.productName}`
      } : null
    }
  }
</script>

<style lang="scss" scoped>

  .container {
    max-width: 960px;
    margin: auto;
  }

  .pager-search-header {
    padding: 20px;
    background-color: white;
    /*
    position: fixed;
    right: 0;
    z-index: 1000;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12);
    */
  }

  .pager-search-items {
    padding: 0 20px 20px 20px;
    margin-top: 0;
  }

  .aside-menu {
    margin-right: 15px;
  }

  .index-main {
    padding: 0 !important;
    position: relative;

    .el-backtop {
      position: absolute;
    }
  }

  .index-main-scrollbar {
    border-right: none;
  }

  .guide-page {
    margin-top: 70px;
    padding: 0 20px 20px 20px;
    position: absolute;
    z-index: 2000;
  }

  .pager-search-items {

    /deep/ .el-loading-spinner {
      top: 230px !important;
    }
  }

  .footer-search-option {
    margin-top: 20px;
  }

  .search-option {
    display: flex;
    align-items: center;

    .search-option-left {
      flex: 1;

    }
  }

  .footer-search-pagination {
    margin-top: 15px;
    text-align: right;
  }

  .pager-header-input {
    padding-left: 30px;
    padding-right: 30px;
    max-width: 500px;
    margin: auto;
  }

</style>
