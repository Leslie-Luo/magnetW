<template>
  <el-container v-loading="loading.page">
    <el-header>
      <pager-header>
        <!--搜索框与排序菜单-->
        <search-input :name="activeRule?activeRule.name:null"
                      class="pager-header-input"
                      @search="handleSearch"
                      v-model="page.current.keyword"></search-input>
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
          <guide-page ref="guidePage" v-show="showGuidePage"></guide-page>
          <div class="pager-search-header" ref="pagerSearchHeader">
            <div class="search-option">
              <!--排序选项-->
              <search-sort
                class="search-option-left"
                :url="page.current.url||activeRule.url"
                :paths="activeRule.paths"
                @change="handleSearch"
                v-model="page.current.sort"></search-sort>
              <!--页码-->
              <search-pagination v-model="page.current.page"
                                 v-show="page.items"
                                 @change="handleSearch"></search-pagination>
            </div>
          </div>
          <!--搜索结果-->
          <div ref="pagerSearchItems" class="pager-search-items" v-loading="loading.table">
            <div class="index-main-content" v-if="page.items">
              <pager-items :items="page.items"
                           :keyword="page.current.keyword"
                           :baseURL="activeRule.url"></pager-items>
              <search-pagination class="footer-search-pagination"
                                 v-model="page.current.page"
                                 @change="handleSearch"></search-pagination>
            </div>
          </div>
        </el-scrollbar>
        <el-backtop target=".index-main-scrollbar .el-scrollbar__wrap">
        </el-backtop>
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
  import axios from '~/plugins/axios'

  export default {
    async asyncData () {
      const { data } = await axios.get('/rule')

      return {
        rule: data
      }
    },
    components: {
      AsideMenu, BrowserLink, SearchSort, SearchInput, SearchPagination, PagerItems, GuidePage, PagerHeader
    },
    data () {
      return {
        page: {
          current: {
            keyword: null
          }
        },
        rule: null,
        activeRule: null,
        loading: {
          table: false,
          page: false
        },
        showGuidePage: true
      }
    },
    methods: {
      handleRuleChanged (id) {
        const activeRule = this.getRuleByID(id) || this.rule[0]

        // 如果当前规则没有此排序 就默认选择一个排序
        let keys = Object.keys(activeRule.paths)
        if (keys.indexOf(this.page.current.sort) === -1) {
          this.page.current.sort = keys[0]
        }
        this.activeRule = activeRule
        this.page.current.id = activeRule.id
        this.page.current.page = 1
        this.page.current.url = activeRule.url
        this.$localSetting.saveValue('last_rule_id', activeRule.id)

        this.handleSearch()
      },
      handleSearch () {
        const params = this.page.current
        if (params.keyword) {
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
      }
    },
    created () {
    },
    mounted () {
      const id = this.$localSetting.get('last_rule_id')
      this.handleRuleChanged(id)
    }
  }
</script>

<style lang="scss" scoped>

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

  .index-main {
    padding: 0 !important;
  }

  .index-main-scrollbar {
    border-right: none;
  }

  .guide-page {
    margin-top: 150px;
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
  }

</style>
