import {
    Button,
    Dialog,
    DatePicker,
    Select,
    Option,
    Radio,
    checkbox,
    MessageBox,
    Form,
    FormItem,
    Input,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Tabs,
    TabPane,
    Table,
    Row,
    Col,
    Link,
    Divider,
    Autocomplete,
    TableColumn,
    ButtonGroup,
    Alert,
	TimePicker,
	CheckboxGroup,
	CheckboxButton,
	RadioGroup,
	Loading,
    Tag,
    Tooltip,
	Upload,
	Empty,
	Card,
    Tree,
    Descriptions,
	Switch,
	Pagination,
	Progress,
	Message,
    Cascader
} from 'element-ui';

const element = {
    install: function(Vue){
        Vue.use(Button)
        Vue.use(Dialog)
        Vue.use(DatePicker)
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(Radio)
        Vue.use(checkbox)
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$Message = Message;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Input)
        Vue.use(Menu)
        Vue.use(Submenu)
        Vue.use(MenuItem)
        Vue.use(MenuItemGroup)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(Table)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Link)
        Vue.use(Divider)
        Vue.use(Autocomplete)
        Vue.use(TableColumn)
        Vue.use(ButtonGroup)
        Vue.use(Alert)
		Vue.use(TimePicker)
		Vue.use(CheckboxGroup)
		Vue.use(CheckboxButton)
		Vue.use(RadioGroup)
		Vue.use(Loading)
        Vue.use(Tag)
        Vue.use(Tooltip)
		Vue.use(Upload)
		Vue.use(Empty)
		Vue.use(Card)
        Vue.use(Tree)
        Vue.use(Descriptions)
		Vue.use(Switch)
		Vue.use(Pagination)
		Vue.use(Progress)	
        Vue.use(Cascader)	
    }
}
 export default element